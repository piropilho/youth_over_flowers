import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const BENEFITS = [
  {
    id: 'insurance',
    emoji: '🛡️',
    iconBg: '#E6F4F0',
    title: '하나손해보험 여행자 보험',
    tag: '무료 가입',
    tagColor: '#008465',
    tagBg: '#D4EDE5',
    desc: '입원·수술·분실 보상까지 여행 기간 전체 무료 보장',
    status: 'available',
  },
  {
    id: 'esim',
    emoji: '📶',
    iconBg: '#EFF6FF',
    title: 'eSIM 3GB 데이터',
    tag: '즉시 지급',
    tagColor: '#2563EB',
    tagBg: '#DBEAFE',
    desc: '개통 즉시 3GB · KT 전국 커버리지 고속 인터넷',
    status: 'available',
  },
  {
    id: 'lounge',
    emoji: '✈️',
    iconBg: '#F5F3FF',
    title: '공항 라운지 이용권',
    tag: '프리미엄',
    tagColor: '#7C3AED',
    tagBg: '#EDE9FE',
    desc: '인천·김포·김해 공항 라운지 귀국 당일 1회 무료',
    status: 'available',
  },
  {
    id: 'smallbiz',
    emoji: '🛍️',
    iconBg: '#FFFBEB',
    title: '소상공인 골목상권 쿠폰',
    tag: '3% 즉시 할인',
    tagColor: '#D97706',
    tagBg: '#FEF3C7',
    desc: '전국 제휴 골목상권 매장 결제 시 3% 자동 캐시백',
    status: 'available',
  },
  {
    id: 'dutyfree',
    emoji: '🧴',
    iconBg: '#FFF1F2',
    title: '면세점 할인쿠폰',
    tag: '5% 할인',
    tagColor: '#DC2626',
    tagBg: '#FEE2E2',
    desc: '출국 전 인천공항 면세점 전 품목 5% 추가 할인',
    status: 'used',
  },
];

const FILTERS = [
  { key: 'all',       label: '전체' },
  { key: 'available', label: '사용 가능' },
  { key: 'used',      label: '사용 완료' },
];

export default function CouponScreen({ navigation }) {
  const [filter, setFilter] = useState('all');
  const filtered = BENEFITS.filter(b => filter === 'all' || b.status === filter);

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
          <Text style={styles.headerTitle}>나의 혜택</Text>
          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M3 11.5L12 3l9 8.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z" stroke={COLORS.textDark} strokeWidth={1.8} fill="none" />
              <Path d="M9 22V12h6v10" stroke={COLORS.textDark} strokeWidth={1.8} />
            </Svg>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Hero Banner */}
          <View style={styles.heroBanner}>
            <Text style={styles.heroTitle}>{'이번 한국 여행에서\n총 5개의 특별 혜택을 받아요 🎁'}</Text>
            <View style={styles.heroValueRow}>
              <Text style={styles.heroValueLabel}>총 혜택 가치</Text>
              <Text style={styles.heroValueAmount}>₩127,000</Text>
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterLabel, filter === f.key && styles.filterLabelActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Benefit Cards */}
          <View style={styles.list}>
            {filtered.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={[styles.item, b.status === 'used' && styles.itemUsed]}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('BenefitDetail', { benefitId: b.id })}
              >
                <View style={styles.iconBox}>
                  <Text style={styles.iconEmoji}>{b.emoji}</Text>
                </View>

                <View style={styles.itemContent}>
                  <View style={[styles.tagBadge, { backgroundColor: b.status === 'used' ? '#EFEFEF' : b.tagBg }]}>
                    <Text style={[styles.tagText, { color: b.status === 'used' ? '#BDBDBD' : b.tagColor }]}>
                      {b.status === 'used' ? '사용 완료' : b.tag}
                    </Text>
                  </View>
                  <Text style={[styles.itemTitle, b.status === 'used' && styles.itemTitleUsed]}>
                    {b.title}
                  </Text>
                  <Text style={[styles.itemDesc, b.status === 'used' && styles.itemDescUsed]}>
                    {b.desc}
                  </Text>
                </View>

                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path d="M9 6l6 6-6 6" stroke={b.status === 'used' ? '#BDBDBD' : '#9CA3AF'} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.mainBtn} onPress={() => navigation.navigate('Home')} activeOpacity={0.85}>
            <Text style={styles.mainBtnText}>메인 화면으로 돌아가기</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.helpText}>도움이 필요하신가요? 지원센터 문의</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: COLORS.white },

  header:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: COLORS.white },
  backBtn:         { padding: 4, marginRight: 4 },
  headerTitle:     { flex: 1, textAlign: 'center', fontFamily: 'Hana2-Bold', fontSize: 17, color: COLORS.textDark },
  homeBtn:         { padding: 4, marginLeft: 4 },

  heroBanner:      { backgroundColor: COLORS.white, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 24, marginBottom: 20 },
  heroEyebrow:     { fontFamily: 'Hana2-Medium', fontSize: 12, color: '#008465', letterSpacing: 0.4, marginBottom: 8 },
  heroTitle:       { fontFamily: 'Hana2-Bold', fontSize: 22, color: COLORS.textDark, lineHeight: 32, marginBottom: 16 },
  heroValueRow:    { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F7F3', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 14 },
  heroValueLabel:  { fontFamily: 'Hana2-Medium', fontSize: 14, color: '#4B5563', flex: 1 },
  heroValueAmount: { fontFamily: 'Hana2-Bold', fontSize: 18, color: '#009675', marginRight: 6 },

  filterRow:       { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8, backgroundColor: COLORS.white, marginBottom: 8 },
  filterTab:       { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0' },
  filterTabActive: { backgroundColor: '#00B488' },
  filterLabel:     { fontFamily: 'Hana2-Medium', fontSize: 13, color: COLORS.textGray },
  filterLabelActive: { color: COLORS.white },

  list:            { paddingHorizontal: 16, paddingBottom: 16, gap: 10 },
  item:            {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9FAFB', borderRadius: 18,
    paddingRight: 16, paddingVertical: 16, gap: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  itemUsed:        { opacity: 0.55 },

  iconBox:         { width: 60, height: 60, borderRadius: 14, backgroundColor: '#EEF6F2', alignItems: 'center', justifyContent: 'center', marginLeft: 16, flexShrink: 0 },
  iconEmoji:       { fontSize: 30 },

  itemContent:     { flex: 1, gap: 4 },
  tagBadge:        { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 2 },
  tagText:         { fontFamily: 'Hana2-Bold', fontSize: 11, overflow: 'hidden' },
  itemTitle:       { fontFamily: 'Hana2-Bold', fontSize: 15, color: COLORS.textDark, lineHeight: 22 },
  itemTitleUsed:   { color: '#BDBDBD' },
  itemDesc:        { fontFamily: 'Hana2-Regular', fontSize: 13, color: '#4B5563', lineHeight: 20 },
  itemDescUsed:    { color: '#BDBDBD' },

  bottom:          { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12, gap: 12, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  mainBtn:         { backgroundColor: '#00B488', borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  mainBtnText:     { fontFamily: 'Hana2-Bold', fontSize: 16, color: COLORS.white },
  helpText:        { fontFamily: 'Hana2-Regular', fontSize: 13, color: COLORS.textGray, textAlign: 'center' },
});
