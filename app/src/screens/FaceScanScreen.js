import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';

const TIPS = [
  '밝은 곳에서 얼굴 전체가 화면 안에 들어오게 위치하세요',
  '안경, 마스크, 모자를 벗어주세요',
  '얼굴 인식이 완료되면 자동으로 회원가입이 완료돼요',
];

export default function FaceScanScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>본인 인증 2/2</Text>
        {/* 데모용 히든 버튼 — 우상단 투명 영역 */}
        <TouchableOpacity
          style={styles.hiddenDemo}
          activeOpacity={1}
          onPress={() => navigation.navigate('FaceScanDemo')}
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>얼굴을 스캔해 주세요</Text>
        <Text style={styles.subtitle}>Scan your face</Text>

        {/* Face icon */}
        <View style={styles.iconWrap}>
          <Svg width={200} height={200} viewBox="0 0 200 200">
            {/* 4 arc segments forming the face boundary */}
            <Path d="M 58.2 50.2 A 65 65 0 0 1 141.8 50.2"  stroke={COLORS.primary} strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <Path d="M 149.8 58.2 A 65 65 0 0 1 149.8 141.8" stroke={COLORS.primary} strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <Path d="M 141.8 149.8 A 65 65 0 0 1 58.2 149.8" stroke={COLORS.primary} strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <Path d="M 50.2 141.8 A 65 65 0 0 1 50.2 58.2"  stroke={COLORS.primary} strokeWidth="5.5" fill="none" strokeLinecap="round" />
            {/* Eyes */}
            <Circle cx="83"  cy="90" r="5" fill={COLORS.primary} />
            <Circle cx="117" cy="90" r="5" fill={COLORS.primary} />
            {/* Smile */}
            <Path d="M 82 112 Q 100 130 118 112" stroke={COLORS.primary} strokeWidth="5" fill="none" strokeLinecap="round" />
          </Svg>
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
        <AnimatedButton
          style={styles.button}
          onPress={() => navigation.navigate('FaceScanCamera')}
        >
          <Text style={styles.buttonText}>안면 인식 시작하기</Text>
        </AnimatedButton>
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
    paddingTop: 24,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Hana2-Bold',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Hana2-Regular',
    color: COLORS.textGray,
    marginBottom: 8,
  },
  iconWrap: {
    alignItems: 'center',
    marginVertical: 16,
  },
  tipBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
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
  hiddenDemo: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
  },
});
