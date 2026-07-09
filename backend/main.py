from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import base64
import json
import os
import tempfile

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
import cv2
import numpy as np
from PIL import Image
import pytesseract
import io
import re
from openai import OpenAI
from passporteye import read_mrz

app = FastAPI(title="HANA EZPZ Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def preprocess_for_mrz(image: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    h, w = gray.shape

    # 하단 30% 크롭
    cropped = gray[int(h * 0.7):]

    # 이진화로 검은 테두리 제거
    _, binary = cv2.threshold(cropped, 128, 255, cv2.THRESH_BINARY)

    # 각 열에서 흰 픽셀 비율로 콘텐츠 영역 감지
    col_white = np.mean(binary, axis=0)
    content_cols = np.where(col_white > 50)[0]
    if len(content_cols) > 10:
        x_start = max(0, content_cols[0])
        x_end = min(w, content_cols[-1])
        cropped = cropped[:, x_start:x_end]

    # 업스케일 후 적응형 이진화 (얼룩/조명 불균일에 강함)
    scale = 2
    resized = cv2.resize(cropped, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
    denoised = cv2.fastNlMeansDenoising(resized, h=10)
    result = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 10)
    return result


def fix_mrz_ocr(line: str, is_line2: bool = False) -> str:
    # 숫자 위치에서 O→0, 문자 위치에서 0→O 보정
    result = list(line)
    digit_positions = set(range(13, 20)) | set(range(19, 26)) | set(range(26, 28)) if is_line2 else set()
    for i, c in enumerate(result):
        if i in digit_positions and c == 'O':
            result[i] = '0'
        elif i not in digit_positions and c == '0':
            result[i] = 'O'
    return "".join(result)


def extract_mrz_lines(text: str) -> list[str]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    mrz_pattern = re.compile(r'^[A-Z0-9<]{30,}$')
    mrz_lines = [l for l in lines if mrz_pattern.match(l)]
    return mrz_lines


def parse_mrz(lines: list[str]) -> dict:
    if len(lines) < 2:
        return {}

    line1 = lines[0].ljust(44, "<")
    line2 = lines[1].ljust(44, "<")

    surname_given = line1[5:44].split("<<", 1)
    surname = surname_given[0].replace("<", " ").strip()
    given = surname_given[1].replace("<", " ").strip() if len(surname_given) > 1 else ""

    dob_raw = line2[13:19]
    year_prefix = "19" if int(dob_raw[:2]) > 30 else "20"
    dob = f"{year_prefix}{dob_raw[:2]}-{dob_raw[2:4]}-{dob_raw[4:6]}"

    expiry_raw = line2[19:25]
    expiry = f"20{expiry_raw[:2]}-{expiry_raw[2:4]}-{expiry_raw[4:6]}"

    nationality = line2[10:13].replace("<", "")
    passport_no = line2[0:9].replace("<", "")
    sex = {"M": "Male", "F": "Female"}.get(line2[20] if len(line2) > 20 else "<", "Unknown")

    return {
        "surname": surname,
        "given_names": given,
        "passport_number": passport_no,
        "nationality": nationality,
        "date_of_birth": dob,
        "expiry_date": expiry,
        "sex": sex,
    }


_face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
_openai = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

_MRZ_SYSTEM_PROMPT = """You are an MRZ (Machine Readable Zone) OCR correction expert for TD3 passports.

MRZ format — 2 lines × 44 characters each:

Line 1 character positions (0-indexed):
  pos 0   : Document type (always 'P') — IGNORE, not part of name
  pos 1   : Document subtype (e.g. '<' or 'M') — IGNORE, not part of name
  pos 2-4 : Issuing country code (3 letters, e.g. 'KOR') — IGNORE, not part of name
  pos 5-43: Name field — SURNAME<<GIVEN NAMES (< is filler/separator)
             Surname and given names are separated by '<<'
             Single '<' separates words within given names

Line 2 character positions (0-indexed):
  pos 0-8 : Passport number (9 chars, padded with <)
  pos 9   : Check digit for passport number
  pos 10-12: Nationality (3 letters)
  pos 13-18: Date of birth (YYMMDD)
  pos 19  : Check digit for DOB
  pos 20  : Sex (M/F/<)
  pos 21-26: Expiry date (YYMMDD)
  pos 27  : Check digit for expiry

Common OCR errors: O↔0, I↔1, L↔1, B↔8, S↔5, Z↔2
Name field (line1 pos 5-43): LETTERS and < ONLY — any digit here is an OCR error
Date fields (pos 13-18, 21-26): DIGITS ONLY — any letter here is an OCR error
Validate numerical fields using check digits (weights 7,3,1 repeating; A=10…Z=35; mod 10).

Return ONLY valid JSON, no markdown:
{"surname":"...","given_names":"...","passport_number":"...","nationality":"...","date_of_birth":"YYYY-MM-DD","sex":"Male or Female or Unknown"}"""


def _gpt_correct_mrz(line1: str, line2: str) -> dict | None:
    try:
        res = _openai.chat.completions.create(
            model="gpt-5.4-mini",
            messages=[
                {"role": "system", "content": _MRZ_SYSTEM_PROMPT},
                {"role": "user", "content": f"Line 1: {line1}\nLine 2: {line2}"},
            ],
            temperature=0,
            max_tokens=300,
        )
        return json.loads(res.choices[0].message.content.strip())
    except Exception:
        return None


class LocationRequest(BaseModel):
    lat: float
    lng: float


_DEMO_SHOPS = [
    {"id": 1,  "name": "석촌 할머니 분식",    "category": "식당", "desc": "50년 전통 떡볶이 맛집",         "dlat":  0.0015, "dlng":  0.0008},
    {"id": 2,  "name": "삼거리 국밥집",        "category": "식당", "desc": "든든한 한 끼, 24시간 운영",    "dlat": -0.0012, "dlng":  0.0018},
    {"id": 3,  "name": "만두가 제일이야",      "category": "식당", "desc": "직접 빚은 수제 만두",          "dlat":  0.0022, "dlng": -0.0010},
    {"id": 4,  "name": "콩나물 국밥",          "category": "식당", "desc": "해장용 뜨끈한 국밥",           "dlat": -0.0005, "dlng": -0.0028},
    {"id": 5,  "name": "골목 카페 봄날",       "category": "카페", "desc": "수제 케이크와 핸드드립 커피",  "dlat": -0.0008, "dlng": -0.0015},
    {"id": 6,  "name": "다방 커피향기",        "category": "카페", "desc": "레트로 감성 카페",             "dlat":  0.0010, "dlng":  0.0025},
    {"id": 7,  "name": "동네 빵집",            "category": "카페", "desc": "매일 아침 갓 구운 빵",        "dlat": -0.0020, "dlng":  0.0005},
    {"id": 8,  "name": "한양 전통시장",        "category": "시장", "desc": "신선 농수산물 직판",           "dlat":  0.0008, "dlng": -0.0022},
    {"id": 9,  "name": "새벽 청과물",          "category": "시장", "desc": "새벽배송 신선 야채",           "dlat": -0.0025, "dlng": -0.0008},
    {"id": 10, "name": "꽃보다 꽃집",          "category": "쇼핑", "desc": "싱싱한 생화 및 화분",          "dlat":  0.0018, "dlng":  0.0020},
    {"id": 11, "name": "문구야 어디가",        "category": "쇼핑", "desc": "동네 문구·잡화점",            "dlat": -0.0015, "dlng":  0.0030},
    {"id": 12, "name": "이발소 미용실",        "category": "쇼핑", "desc": "20년 단골 이발소",             "dlat":  0.0030, "dlng": -0.0005},
]


@app.post("/map/nearby")
def map_nearby(req: LocationRequest):
    shops = [
        {
            "id":       s["id"],
            "name":     s["name"],
            "category": s["category"],
            "desc":     s["desc"],
            "lat":      req.lat + s["dlat"],
            "lng":      req.lng + s["dlng"],
        }
        for s in _DEMO_SHOPS
    ]
    return {"success": True, "shops": shops, "total": len(shops)}


class FaceScanRequest(BaseModel):
    image: str  # base64 encoded JPEG


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/scan/face")
async def scan_face(req: FaceScanRequest):
    try:
        img_bytes = base64.b64decode(req.image)
        image = np.array(Image.open(io.BytesIO(img_bytes)).convert("RGB"))
    except Exception:
        raise HTTPException(status_code=400, detail="Cannot read image file")

    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    faces = _face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))

    if len(faces) == 0:
        return {"success": False, "face_detected": False, "num_faces": 0, "message": "얼굴이 감지되지 않았습니다."}

    return {
        "success": True,
        "face_detected": True,
        "num_faces": len(faces),
        "confidence": 1.0,
    }


class PassportScanRequest(BaseModel):
    image: str  # base64 encoded JPEG


def _parse_date(yymmdd: str, future: bool = False) -> str:
    if not yymmdd or len(yymmdd) < 6:
        return yymmdd
    yy, mm, dd = yymmdd[:2], yymmdd[2:4], yymmdd[4:6]
    prefix = "20" if (future or int(yy) <= 30) else "19"
    return f"{prefix}{yy}-{mm}-{dd}"


@app.post("/scan/passport")
async def scan_passport(req: PassportScanRequest):
    try:
        img_bytes = base64.b64decode(req.image)
    except Exception:
        raise HTTPException(status_code=400, detail="Cannot read image file")

    # 1차: passporteye — valid 여부와 무관하게 raw 라인 추출 후 GPT로 넘김
    # (이름 필드는 체크섬 없음 → valid=True여도 이름 OCR 오류 있을 수 있음)
    tmp_path = None
    raw_line1, raw_line2 = None, None
    passporteye_fallback = None  # GPT 실패 시 사용할 passporteye 결과
    try:
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
            f.write(img_bytes)
            tmp_path = f.name
        mrz = read_mrz(tmp_path)
        if mrz is not None:
            if mrz.valid:
                sex_map = {'M': 'Male', 'F': 'Female'}
                passporteye_fallback = {
                    "surname":         (mrz.surname or '').replace('<', ' ').strip(),
                    "given_names":     (mrz.given_names or '').replace('<', ' ').strip(),
                    "passport_number": (mrz.number or '').replace('<', ''),
                    "nationality":     (mrz.nationality or '').replace('<', ''),
                    "date_of_birth":   _parse_date(mrz.date_of_birth),
                    "expiry_date":     _parse_date(mrz.expiration_date, future=True),
                    "sex":             sex_map.get(mrz.sex, 'Unknown'),
                }
            # valid/invalid 모두 raw 라인 재구성 → GPT 교정
            name = f"{mrz.surname or ''}<<{mrz.given_names or ''}"
            raw_line1 = f"P<{mrz.country or '<<<'}{name}".ljust(44, '<')[:44]
            raw_line2 = (
                f"{mrz.number or '<<<<<<<<<'}"
                f"{mrz.check_number or '<'}"
                f"{mrz.nationality or '<<<'}"
                f"{mrz.date_of_birth or '<<<<<<'}"
                f"{mrz.check_date_of_birth or '<'}"
                f"{mrz.sex or '<'}"
                f"{mrz.expiration_date or '<<<<<<'}"
                f"{mrz.check_expiration_date or '<'}"
            ).ljust(44, '<')[:44]
    except Exception:
        pass
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)

    # 2차: passporteye raw 라인 없으면 Tesseract로 추출
    if not raw_line1 or not raw_line2:
        try:
            image = np.array(Image.open(io.BytesIO(img_bytes)).convert("RGB"))
            processed = preprocess_for_mrz(image)
            config = "--oem 1 --psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<"
            text = pytesseract.image_to_string(processed, config=config)
            mrz_lines = extract_mrz_lines(text)
            if len(mrz_lines) >= 2:
                raw_line1 = fix_mrz_ocr(mrz_lines[0])
                raw_line2 = fix_mrz_ocr(mrz_lines[1], is_line2=True)
        except Exception:
            pass

    if not raw_line1 or not raw_line2:
        return {"success": False, "message": "MRZ를 인식하지 못했습니다. MRZ 줄이 잘 보이도록 다시 촬영해주세요."}

    # GPT로 OCR 오류 교정
    corrected = _gpt_correct_mrz(raw_line1, raw_line2)
    if corrected:
        if passporteye_fallback:
            # 이름만 GPT로 교정, 체크섬 통과한 필드는 passporteye 값 사용
            return {"success": True, "data": {
                **corrected,
                "passport_number": passporteye_fallback["passport_number"],
                "nationality":     passporteye_fallback["nationality"],
                "date_of_birth":   passporteye_fallback["date_of_birth"],
                "expiry_date":     passporteye_fallback.get("expiry_date"),
                "sex":             passporteye_fallback["sex"],
            }}
        return {"success": True, "data": corrected}

    # GPT 실패 시 passporteye 결과 → Tesseract 파싱 순으로 fallback
    if passporteye_fallback:
        return {"success": True, "data": passporteye_fallback}
    return {"success": True, "data": parse_mrz([raw_line1, raw_line2])}
