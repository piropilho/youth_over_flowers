import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const BENEFITS = [
  { icon: '🛡️', label: '여행자 보험', title: '하나손해보험 외국인 여행자 보험 무료 가입' },
  { icon: '📶', label: 'eSIM 데이터', title: '한국 어디서든 빠른 인터넷 3GB eSIM 제공' },
  { icon: '🛍️', label: '소상공인 쿠폰', title: '골목 상권 제휴매장 결제 시 3% 추가 할인' },
];

export default function ChargeSuccessScreen({ route, navigation }) {
  const { krw = 0, foreignAmount = 0, currencySymbol = '$' } = route.params ?? {};

  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1,
        tension: 55,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const krwFormatted     = Math.round(krw).toLocaleString('ko-KR');
  const foreignFormatted = foreignAmount.toLocaleString('ko-KR');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* 성공 아이콘 영역 */}
        <View style={styles.heroSection}>
          <Animated.View style={[styles.checkRing, { transform: [{ scale }] }]}>
            <View style={styles.checkCircle}>
              <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
                <Path
                  d="M10 24 L19 33 L38 15"
                  stroke="white"
                  strokeWidth={4.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          </Animated.View>

          <Animated.View style={{ alignItems: 'center', opacity }}>
            <Text style={styles.successTitle}>충전이 완료됐어요!</Text>
            <Text style={styles.successSub}>잔액이 안전하게 충전됐습니다</Text>
          </Animated.View>
        </View>

        {/* 충전 금액 카드 */}
        <Animated.View style={[styles.amountCard, { opacity }]}>
          <Text style={styles.amountLabel}>충전 금액</Text>
          <Text style={styles.amountMain}>₩ {krwFormatted}</Text>
          <Text style={styles.amountSub}>≈ {currencySymbol}{foreignFormatted}</Text>
        </Animated.View>

        {/* 혜택 카드 */}
        <Animated.View style={[styles.benefitsCard, { opacity }]}>
          <Text style={styles.benefitsTitle}>적용된 충전 혜택</Text>
          {BENEFITS.map((item, index) => (
            <View key={item.label}>
              <View style={styles.benefitRow}>
                <Text style={styles.benefitIcon}>{item.icon}</Text>
                <View style={styles.benefitTextWrap}>
                  <Text style={styles.benefitBadge}>{item.label}</Text>
                  <Text style={styles.benefitTitle}>{item.title}</Text>
                </View>
              </View>
              {index < BENEFITS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Animated.View>

      </ScrollView>

      {/* 하단 CTA */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.subBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Coupon')}
        >
          <Text style={styles.subBtnText}>혜택 상세보기 →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mainBtn}
          activeOpacity={0.85}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
        >
          <Text style={styles.mainBtnText}>확인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: COLORS.white },
  scroll:          { paddingBottom: 16 },

  heroSection:     { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  checkRing:       {
    width: 116, height: 116, borderRadius: 58,
    backgroundColor: 'rgba(0,180,136,0.10)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
  },
  checkCircle:     {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: '#00B488',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#00B488',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  successTitle:    { fontFamily: 'Hana2-Bold', fontSize: 24, color: COLORS.textDark, marginBottom: 8 },
  successSub:      { fontFamily: 'Hana2-Regular', fontSize: 14, color: '#9CA3AF' },

  amountCard:      {
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: '#F2F9F6', borderRadius: 18,
    paddingVertical: 28, paddingHorizontal: 24,
    alignItems: 'center',
  },
  amountLabel:     { fontFamily: 'Hana2-Medium', fontSize: 13, color: '#9CA3AF', letterSpacing: 0.3, marginBottom: 10 },
  amountMain:      { fontFamily: 'Hana2-Bold', fontSize: 38, color: COLORS.textDark, letterSpacing: -1.5, marginBottom: 6 },
  amountSub:       { fontFamily: 'Hana2-Regular', fontSize: 15, color: '#008465' },

  benefitsCard:    {
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: '#F8FAFB', borderRadius: 18,
    paddingVertical: 20, paddingHorizontal: 20,
  },
  benefitsTitle:   { fontFamily: 'Hana2-Bold', fontSize: 15, color: COLORS.textDark, marginBottom: 8 },
  benefitRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11 },
  benefitIcon:     { fontSize: 18 },
  benefitTextWrap: { flex: 1, flexDirection: 'column', alignItems: 'flex-start' },
  benefitBadge:    { fontFamily: 'Hana2-Bold', fontSize: 11, color: '#008465', backgroundColor: '#E6F4F0', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, overflow: 'hidden' },
  benefitTitle:    { fontFamily: 'Hana2-Medium', fontSize: 13, color: COLORS.textDark, lineHeight: 18, marginTop: 4 },
  divider:         { height: 1, backgroundColor: '#EEF0F2' },

  bottom:          { paddingHorizontal: 20, paddingBottom: 28, paddingTop: 8, gap: 4 },
  subBtn:          { alignItems: 'center', paddingVertical: 12 },
  subBtnText:      { fontFamily: 'Hana2-Medium', fontSize: 14, color: '#008465' },
  mainBtn:         {
    backgroundColor: '#00B488', borderRadius: 14,
    paddingVertical: 18, alignItems: 'center',
  },
  mainBtnText:     { fontFamily: 'Hana2-Bold', fontSize: 16, color: COLORS.white },
});
