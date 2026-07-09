import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import {Text} from 'react-native';
import { COLORS } from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';

const SHADOW_LAYERS = Array.from({ length: 15 }, (_, i) => {
  const t = i / 14;
  return {
    width:   Math.round(110 - t * 80),
    height:  Math.round(22  - t * 16),
    opacity: 0.01 + t * 0.08,
  };
});

const AUTH_STEPS = ['여권 스캔', '안면 인식'];

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

      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Animated.Image
            source={require('../../assets/secure.png')}
            style={[styles.image, { transform: [{ translateY: floatAnim }] }]}
          />
          <View style={styles.shadowContainer}>
            {SHADOW_LAYERS.map((layer, i) => (
              <View key={i} style={[styles.shadowLayer, { width: layer.width, height: layer.height, opacity: layer.opacity }]} />
            ))}
          </View>
        </View>
        <Text style={{fontFamily : 'Hana2-Medium', fontSize : 22}}>본인인증을 진행할게요.</Text>

        <View style={styles.methodList}>
          {AUTH_STEPS.map((label, i) => (
            <View key={i} style={styles.methodItem}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.methodLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottom}>
        <AnimatedButton
          style={styles.button}
          onPress={() => navigation.navigate('PassportScan')}
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
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
    borderRadius: 50,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
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
  methodList: {
    gap: 12,
    marginTop: 24,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: 'Hana2-Medium',
    fontSize: 12,
    color: COLORS.primary,
    lineHeight: 14,
  },
  methodLabel: {
    fontFamily: 'Hana2-Regular',
    fontSize: 15,
    color: COLORS.textDark,
  },
  hiddenSkip: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  button: {
    backgroundColor: COLORS.primary,
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
