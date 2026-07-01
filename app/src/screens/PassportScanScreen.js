import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS } from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';

const CHECK_PATH   = 'M 35 100 L 75 138 L 170 55';
const CHECK_LENGTH = 185;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAM_WIDTH = SCREEN_WIDTH - 48;
const CAM_HEIGHT = Math.round(CAM_WIDTH * 0.72);

const BACKEND_URL = 'http://192.168.35.200:8000';

export default function PassportScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [errorMsg, setErrorMsg] = useState(null);
  const [checkOffset, setCheckOffset] = useState(CHECK_LENGTH);
  const cameraRef = useRef(null);
  const scanAnim  = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(CHECK_LENGTH)).current;
  const scanLoop  = useRef(null);

  useEffect(() => {
    const id = checkAnim.addListener(({ value }) => {
      setCheckOffset(Math.max(0, Math.min(value, CHECK_LENGTH)));
    });
    return () => checkAnim.removeListener(id);
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    );
    scanLoop.current = loop;
    loop.start();
  }, []);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const scanY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CAM_HEIGHT - 2],
  });

  const showSuccess = (passportData) => {
    scanLoop.current?.stop();
    setPhase('success');
    checkAnim.setValue(CHECK_LENGTH);
    Animated.timing(checkAnim, {
      toValue: 0,
      duration: 750,
      easing: Easing.out(Easing.elastic(1.2)),
      useNativeDriver: false,
    }).start();
    setTimeout(() => navigation.navigate('PassportConfirm', { passportData }), 1500);
  };

  const handleCapture = async () => {
    if (!permission?.granted) {
      await requestPermission();
      return;
    }
    setPhase('processing');
    setErrorMsg(null);

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: true });
      const res = await fetch(`${BACKEND_URL}/scan/passport`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photo.base64 }),
      });
      const data = await res.json();

      if (data.success) {
        showSuccess(data.data);
      } else {
        setPhase('idle');
        setErrorMsg(data.message || 'MRZ를 인식하지 못했습니다. 다시 시도해주세요.');
      }
    } catch (e) {
      setPhase('idle');
      setErrorMsg('서버 연결에 실패했습니다. 네트워크를 확인해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>본인 인증 1/2</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>여권을 스캔해 주세요</Text>
        <Text style={styles.subtitle}>Scan your passport · MRZ zone</Text>

        {/* Camera Box */}
        <View style={[styles.cameraBox, { width: CAM_WIDTH, height: CAM_HEIGHT }]}>
          {permission?.granted ? (
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.camPlaceholder]} />
          )}

          {/* Corner brackets */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {/* Scan line — success 단계에서 숨김 */}
          {phase !== 'success' && (
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanY }] }]} />
          )}

          {/* Label */}
          {phase === 'idle' && (
            <View style={styles.scanLabelBox}>
              <Text style={styles.scanLabel}>+ 스캔 중</Text>
            </View>
          )}

          {/* Success overlay */}
          {phase === 'success' && (
            <View style={[styles.successOverlay, { width: CAM_WIDTH, height: CAM_HEIGHT }]}>
              <Svg width={200} height={200} viewBox="0 0 200 200">
                <Path
                  d={CHECK_PATH}
                  stroke="white"
                  strokeWidth={14}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={CHECK_LENGTH}
                  strokeDashoffset={checkOffset}
                />
              </Svg>
            </View>
          )}
        </View>

        <Text style={styles.caption}>여권 하단 MRZ 줄을 프레임 안에 맞춰주세요</Text>

        {/* Tip */}
        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡  Tip</Text>
          <Text style={styles.tipText}>
            밝은 곳에서 여권을 평평하게 놓고 스캔하세요.{'\n'}반사광이 없어야 잘 인식됩니다.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom */}
      <View style={styles.bottom}>
        {errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
        {phase === 'processing' ? (
          <View style={[styles.button, styles.buttonDisabled]}>
            <Text style={styles.buttonText}>인식 중...</Text>
          </View>
        ) : phase === 'success' ? (
          <View style={[styles.button, styles.buttonDisabled]}>
            <Text style={styles.buttonText}>인식 완료</Text>
          </View>
        ) : (
          <AnimatedButton style={styles.button} onPress={handleCapture}>
            <Text style={styles.buttonText}>{errorMsg ? '다시 촬영하기' : '촬영하기'}</Text>
          </AnimatedButton>
        )}
        <TouchableOpacity>
          <Text style={styles.helpText}>도움이 필요하신가요? 지원센터 문의</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontSize: 32,
    color: COLORS.textDark,
    lineHeight: 34,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Hana2-Bold',
    color: COLORS.textDark,
    zIndex: -1,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Hana2-Bold',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Hana2-Regular',
    color: COLORS.textGray,
    marginBottom: 24,
  },
  cameraBox: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111',
    alignSelf: 'center',
    marginBottom: 16,
  },
  camPlaceholder: {
    backgroundColor: '#111',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: COLORS.primary,
  },
  cornerTL: {
    top: 14,
    left: 14,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 3,
  },
  cornerTR: {
    top: 14,
    right: 14,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 3,
  },
  cornerBL: {
    bottom: 14,
    left: 14,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 3,
  },
  cornerBR: {
    bottom: 14,
    right: 14,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 3,
  },
  scanLine: {
    position: 'absolute',
    left: 14,
    right: 14,
    height: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  scanLabelBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 12,
  },
  scanLabel: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.primary,
  },
  caption: {
    fontSize: 13,
    fontFamily: 'Hana2-Regular',
    color: COLORS.textGray,
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  tipBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  tipTitle: {
    fontFamily: 'Hana2-Medium',
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 8,
  },
  tipText: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: COLORS.textGray,
    lineHeight: 20,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  errorBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  errorText: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: '#D0302F',
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 132, 133, 0.72)',
  },
  buttonText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 16,
    color: COLORS.white,
  },
  helpText: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: COLORS.textGray,
    textAlign: 'center',
  },
});
