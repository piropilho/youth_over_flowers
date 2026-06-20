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

const AnimatedPath = Animated.createAnimatedComponent(Path);
const CHECK_PATH   = 'M 35 100 L 75 138 L 170 55';
const CHECK_LENGTH = 185;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAM_WIDTH = SCREEN_WIDTH - 48;
const CAM_HEIGHT = Math.round(CAM_WIDTH * 0.72);

export default function PassportScanScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const scanAnim   = useRef(new Animated.Value(0)).current;
  const checkAnim  = useRef(new Animated.Value(CHECK_LENGTH)).current;

  const checkDashOffset = checkAnim.interpolate({
    inputRange:  [0, CHECK_LENGTH],
    outputRange: [0, CHECK_LENGTH],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!permission?.granted) return;
    const delay = setTimeout(startScan, 800);
    return () => clearTimeout(delay);
  }, [permission?.granted]);

  const scanY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CAM_HEIGHT - 2],
  });

  const startScan = () => {
    setTimeout(() => {
      setScanning(true);
      checkAnim.setValue(CHECK_LENGTH);
      Animated.timing(checkAnim, {
        toValue: 0,
        duration: 750,
        easing: Easing.out(Easing.elastic(1.2)),
        useNativeDriver: false,
      }).start();
      setTimeout(() => {
        navigation.navigate('FaceScan');
      }, 1500);
    }, 3000);
  };

  const handleButton = async () => {
    if (!permission?.granted) {
      await requestPermission();
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
            <CameraView style={StyleSheet.absoluteFill} facing="back" />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.camPlaceholder]} />
          )}

          {/* Corner brackets */}
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />

          {/* Scan line */}
          <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanY }] }]} />

          {/* Label */}
          <View style={styles.scanLabelBox}>
            <Text style={styles.scanLabel}>+ 스캔 중</Text>
          </View>

          {/* Success overlay */}
          {scanning && (
            <View style={styles.successOverlay}>
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
        {scanning ? (
          <View style={[styles.button, styles.buttonDisabled]}>
            <Text style={styles.buttonText}>인식 중...</Text>
          </View>
        ) : (
          <AnimatedButton style={styles.button} onPress={handleButton}>
            <Text style={styles.buttonText}>직접 촬영하기</Text>
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
    ...StyleSheet.absoluteFillObject,
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
