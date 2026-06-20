import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS } from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAM_SIZE   = SCREEN_WIDTH - 64;
const RING_R     = CAM_SIZE / 2 + 8;
const SVG_SIZE   = RING_R * 2 + 14;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath   = Animated.createAnimatedComponent(Path);

// 체크 경로: M 35 100 → 75 138 → 170 55 (200×200 viewBox 기준)
const CHECK_PATH   = 'M 35 100 L 75 138 L 170 55';
const CHECK_LENGTH = 185;

const TIPS = [
  '밝은 곳에서 얼굴 전체가 화면 안에 들어오게 위치하세요',
  '안경, 마스크, 모자를 벗어주세요',
  '얼굴 인식이 완료되면 자동으로 회원가입이 완료돼요',
];

export default function FaceScanCameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning]   = useState(false);
  const [countdown, setCountdown] = useState(3);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const checkAnim    = useRef(new Animated.Value(CHECK_LENGTH)).current;

  const strokeDashoffset = progressAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const checkDashOffset = checkAnim.interpolate({
    inputRange:  [0, CHECK_LENGTH],
    outputRange: [0, CHECK_LENGTH],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const startScan = () => {
    setScanning(true);
    setCountdown(3);
    progressAnim.setValue(0);

    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) clearInterval(timer);
    }, 1000);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        clearInterval(timer);
        setCountdown(0);
        checkAnim.setValue(CHECK_LENGTH);
        Animated.timing(checkAnim, {
          toValue: 0,
          duration: 750,
          easing: Easing.out(Easing.elastic(1.2)),
          useNativeDriver: false,
        }).start();
        setTimeout(() => {
          navigation.navigate('VerificationComplete');
        }, 1500);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>본인 인증 2/2</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>카메라를 정면으로 바라봐주세요</Text>
        <Text style={styles.subtitle}>Look straight at the camera for 3 seconds</Text>

        {/* Camera + progress ring */}
        <View style={styles.cameraContainer}>
          {/* Progress ring SVG */}
          <Svg width={SVG_SIZE} height={SVG_SIZE} style={StyleSheet.absoluteFill}>
            <Circle
              cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={RING_R}
              stroke="#E8E8E8" strokeWidth={5} fill="none"
            />
            {scanning && (
              <AnimatedCircle
                cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={RING_R}
                stroke={COLORS.primary} strokeWidth={5} fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${SVG_SIZE / 2}, ${SVG_SIZE / 2}`}
              />
            )}
          </Svg>

          {/* Circular camera */}
          <View style={styles.cameraWrap}>
            {permission?.granted ? (
              <CameraView style={StyleSheet.absoluteFill} facing="front" />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.camPlaceholder]} />
            )}

            {/* Countdown overlay */}
            {scanning && (
              <View style={[styles.countdownOverlay, countdown === 0 && styles.successOverlay]}>
                {countdown > 0 ? (
                  <Text style={styles.countdownText}>{countdown}</Text>
                ) : (
                  <Svg width={200} height={200} viewBox="0 0 200 200">
                    <AnimatedPath
                      d={CHECK_PATH}
                      stroke="white"
                      strokeWidth={14}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={CHECK_LENGTH}
                      strokeDashoffset={checkDashOffset}
                    />
                  </Svg>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipBox}>
          {TIPS.map((tip, i) => (
            <View key={i} style={[styles.tipRow, i < TIPS.length - 1 && styles.tipRowBorder]}>
              <View style={styles.tipNum}>
                <Text style={styles.tipNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        {scanning ? (
          <View style={[styles.button, styles.buttonDisabled]}>
            <Text style={styles.buttonText}>인식 중...</Text>
          </View>
        ) : (
          <AnimatedButton style={styles.button} onPress={startScan}>
            <Text style={styles.buttonText}>스캔 시작하기</Text>
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Hana2-Bold',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Hana2-Regular',
    color: COLORS.textGray,
    marginBottom: 20,
  },
  cameraContainer: {
    width: SVG_SIZE,
    height: SVG_SIZE,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cameraWrap: {
    width: CAM_SIZE,
    height: CAM_SIZE,
    borderRadius: CAM_SIZE / 2,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  camPlaceholder: {
    backgroundColor: '#111',
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  successOverlay: {
    backgroundColor: 'rgba(0, 132, 133, 0.72)',
  },
  countdownText: {
    fontSize: 72,
    fontFamily: 'Hana2-Bold',
    color: COLORS.white,
  },
  tipBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  tipRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  tipNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipNumText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 12,
    color: COLORS.primary,
  },
  tipText: {
    flex: 1,
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: COLORS.textDark,
    lineHeight: 19,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: COLORS.primary,
    opacity: 0.5,
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
