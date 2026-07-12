import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const BENEFIT_DATA = {
  insurance: {
    screenTitle: '여행자 보험',
    mainTitle: '여행자 보험\n하나손해보험에서 보장해줘요!',
    image: require('../../assets/insurance.png'),
    info: [
      { label: '조건',        value: '선불 충전 완료' },
      { label: '혜택',        value: '하나손해보험 외국인 여행자 보험' },
      { label: '쿠폰번호',    value: '123456789' },
      { label: '유효기간',    value: '한국 귀국 전' },
      { label: '쿠폰 사용처', value: '온라인 등록' },
    ],
    actionLabel: '보험 자세히 보기',
  },
  esim: {
    screenTitle: 'eSIM',
    mainTitle: '한국 어디서든\n빠른 인터넷을 무료로 써요!',
    image: require('../../assets/clock.png'),
    info: [
      { label: '조건',        value: '선불 충전 완료' },
      { label: '혜택',        value: '3GB eSIM 제공' },
      { label: '쿠폰번호',    value: '123456789' },
      { label: '유효기간',    value: '한국 귀국 전' },
      { label: '쿠폰 사용처', value: '온라인 등록' },
    ],
    actionLabel: '등록하러 가기',
  },
  smallbiz: {
    screenTitle: '소상공인 매장 할인쿠폰',
    mainTitle: '골목 상권\n방문시 할인된 가격으로!',
    image: require('../../assets/coupon.png'),
    info: [
      { label: '조건',        value: '선불 충전 완료' },
      { label: '혜택',        value: '제휴매장 HANA EZPZ로 결제시 3% 할인' },
      { label: '유효기간',    value: '한국 귀국 전' },
      { label: '쿠폰 사용처', value: '바코드 입력' },
    ],
    actionLabel: '혜택 자세히 보기',
  },
};

export default function BenefitDetailScreen({ route, navigation }) {
  const { benefitId } = route.params ?? {};
  const data = BENEFIT_DATA[benefitId];

  if (!data) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Hana2-Regular', fontSize: 15, color: COLORS.textGray }}>준비 중인 혜택입니다</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <SafeAreaView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M15 18l-6-6 6-6" stroke={COLORS.textDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{data.screenTitle}</Text>
          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M3 11.5L12 3l9 8.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z" stroke={COLORS.textDark} strokeWidth={1.8} fill="none" />
              <Path d="M9 22V12h6v10" stroke={COLORS.textDark} strokeWidth={1.8} />
            </Svg>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.mainTitle}>{data.mainTitle}</Text>
            <Image source={data.image} style={styles.heroImage} resizeMode="contain" />
          </View>

          {/* Info Table */}
          <View style={styles.infoCard}>
            {data.info.map((item, index) => (
              <View key={item.label}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
                {index < data.info.length - 1 && <View style={styles.infoDivider} />}
              </View>
            ))}
          </View>

        </ScrollView>

        {/* Fixed Bottom Buttons */}
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.closeBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <Text style={styles.closeBtnText}>닫기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85} onPress={() => {}}>
            <Text style={styles.actionBtnText}>{data.actionLabel}</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: COLORS.white },

  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  backBtn:       { padding: 4, marginRight: 4 },
  headerTitle:   { flex: 1, textAlign: 'center', fontFamily: 'Hana2-Bold', fontSize: 17, color: COLORS.textDark },
  homeBtn:       { padding: 4, marginLeft: 4 },

  scroll:        { paddingBottom: 32 },

  heroSection:   { alignItems: 'center', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 8 },
  mainTitle:     { fontFamily: 'Hana2-Bold', fontSize: 22, color: COLORS.textDark, textAlign: 'center', lineHeight: 34, marginBottom: 36 },
  heroImage:     { width: 220, height: 220 },

  infoCard:      { marginHorizontal: 20, marginTop: 28, backgroundColor: '#F9FAFB', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 20 },
  infoRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  infoLabel:     { fontFamily: 'Hana2-Regular', fontSize: 14, color: '#9CA3AF' },
  infoValue:     { fontFamily: 'Hana2-Medium', fontSize: 14, color: COLORS.textDark, textAlign: 'right', flex: 1, marginLeft: 16 },
  infoDivider:   { height: 1, backgroundColor: '#EBEBEB' },

  bottom:        { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 28, paddingTop: 12, gap: 10, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  closeBtn:      { flex: 1, backgroundColor: '#EBF5F3', borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  closeBtnText:  { fontFamily: 'Hana2-Bold', fontSize: 15, color: '#008465' },
  actionBtn:     { flex: 2, backgroundColor: '#008465', borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  actionBtnText: { fontFamily: 'Hana2-Bold', fontSize: 15, color: COLORS.white },
});
