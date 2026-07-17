import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import {Text} from 'react-native';
import { COLORS } from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';

const SHADOW_LAYERS = Array.from({ length: 10 }, (_, i) => {
  const t = i / 9;
  return {
    width:   Math.round(130 - t * 80),
    height:  Math.round(16  - t * 8),
    opacity: 0.018 + t * 0.038,
  };
});

const AUTH_STEPS = [
  { label: '여권 스캔', sub: '빛 번짐이 없는 곳에서 촬영해 주세요.' },
  { label: '안면 인식', sub: '카메라를 정면으로 바라봐 주세요.' },
];

export default function VerificationScreen({ navigation }) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -16, duration: 1200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,  duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnText}>‹</Text>
      </TouchableOpacity>

      {/* 히든 스킵 버튼 — 우측 상단 투명 영역 */}
      <TouchableOpacity
        style={styles.hiddenSkip}
        activeOpacity={1}
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
      />

      {/* 진행 단계 인디케이터 */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, styles.progressActive, { marginRight: 6 }]} />
        <View style={[styles.progressBar, styles.progressInactive, { marginRight: 6 }]} />
        <View style={[styles.progressBar, styles.progressInactive]} />
      </View>

      <View style={styles.content}>

        {/* 타이틀 */}
        <View style={styles.titleSection}>
          <Text style={styles.titleSub}>안전한 이용을 위해</Text>
          <Text style={styles.titleMain}>본인인증을 시작할게요</Text>
        </View>

        {/* 자물쇠 캐릭터 */}
        <View style={styles.imageWrapper}>
          <Animated.Image
            source={require('../../assets/locker-star.png')}
            style={[styles.image, { transform: [{ translateY: floatAnim }] }]}
          />
          <View style={styles.shadowContainer}>
            {SHADOW_LAYERS.map((layer, i) => (
              <View key={i} style={[styles.shadowLayer, { width: layer.width, height: layer.height, opacity: layer.opacity }]} />
            ))}
          </View>
        </View>

        {/* 스텝 카드 */}
        <View style={styles.methodList}>
          {AUTH_STEPS.map((step, i) => (
            <View key={i} style={styles.stepCard}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <View style={styles.stepTextCol}>
                <Text style={styles.methodLabel}>{step.label}</Text>
                <Text style={styles.stepSub}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <AnimatedButton
          style={styles.button}
          onPress={() => navigation.navigate('PassportScanDemo')}
        >
          <Text style={styles.buttonText}>여권 스캔하기</Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingTop: 14,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontSize: 32,
    color: COLORS.textDark,
    lineHeight: 34,
  },
  hiddenSkip: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
  },

  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 4,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: '#008465',
  },
  progressInactive: {
    backgroundColor: '#E5E7EB',
  },

  content: {
    flex: 1,
    paddingTop: 8,
  },

  titleSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  titleSub: {
    fontFamily: 'Hana2-Medium',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  titleMain: {
    fontFamily: 'Hana2-Bold',
    fontSize: 24,
    color: '#111827',
    textAlign: 'center',
    marginTop: 6,
  },

  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    backfaceVisibility: 'hidden',
  },
  shadowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    height: 18,
  },
  shadowLayer: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: '#6B7280',
  },

  methodList: {
    gap: 12,
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2FAF7',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#EBF5F3',
    padding: 20,
    gap: 16,
  },
  stepTextCol: {
    flex: 1,
    gap: 6,
  },
  stepSub: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 15,
    color: COLORS.primary,
    lineHeight: 17,
  },
  methodLabel: {
    fontFamily: 'Hana2-Bold',
    fontSize: 18,
    color: COLORS.textDark,
  },

  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  button: {
    backgroundColor: '#05A68B',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Hana2-Bold',
  },
});
