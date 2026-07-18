import React, { useState } from 'react';
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

const BENEFITS = [
  {
    id: 'insurance',
    image: require('../../assets/shield.png'),
    title: '여행자 보험',
    tag: '무료 가입',
    tagColor: '#008465',
    tagBg: '#D4EDE5',
    desc: '입원·수술·분실 전 기간 무료 보장',
    status: 'available',
  },
  {
    id: 'esim',
    image: require('../../assets/esim.png'),
    title: 'eSIM 3GB 데이터',
    tag: '즉시 지급',
    tagColor: '#2563EB',
    tagBg: '#DBEAFE',
    desc: '개통 즉시 KT 전국 고속 인터넷',
    status: 'available',
  },
  {
    id: 'lounge',
    image: require('../../assets/lounge.png'),
    title: '공항 라운지',
    tag: '프리미엄',
    tagColor: '#7C3AED',
    tagBg: '#EDE9FE',
    desc: '귀국 당일 공항 라운지 1회 무료',
    status: 'available',
  },
  {
    id: 'smallbiz',
    image: require('../../assets/store.png'),
    title: '골목상권 쿠폰',
    tag: '3% 즉시 할인',
    tagColor: '#D97706',
    tagBg: '#FEF3C7',
    desc: '전국 제휴 골목상권 캐시백',
    status: 'available',
  },
  {
    id: 'dutyfree',
    emoji: '🧴',
    title: '면세점 할인쿠폰',
    tag: '5% 할인',
    tagColor: '#DC2626',
    tagBg: '#FEE2E2',
    desc: '인천공항 면세점 전 품목 할인',
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

          {/* 2-Column Grid */}
          <View style={styles.grid}>
            {filtered.map((b) => (
              <TouchableOpacity
                key={b.id}
                style={[styles.card, b.status === 'used' && styles.cardUsed]}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('BenefitDetail', { benefitId: b.id })}
              >
                {/* Tag */}
                <View style={[
                  styles.tagBadge,
                  { backgroundColor: b.status === 'used' ? '#EFEFEF' : b.tagBg },
                ]}>
                  <Text style={[
                    styles.tagText,
                    { color: b.status === 'used' ? '#BDBDBD' : b.tagColor },
                  ]}>
                    {b.status === 'used' ? '사용 완료' : b.tag}
                  </Text>
                </View>

                {/* Icon */}
                {b.image
                  ? <Image source={b.image} style={styles.cardImage} resizeMode="contain" />
                  : <Text style={styles.cardEmoji}>{b.emoji}</Text>
                }

                {/* Title */}
                <Text style={styles.cardTitle} numberOfLines={2}>{b.title}</Text>

                {/* Short desc */}
                <Text style={styles.cardDesc} numberOfLines={2}>{b.desc}</Text>
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
  container:        { flex: 1, backgroundColor: COLORS.white },

  header:           { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: COLORS.white },
  backBtn:          { padding: 4, marginRight: 4 },
  headerTitle:      { flex: 1, textAlign: 'center', fontFamily: 'Hana2-Bold', fontSize: 17, color: COLORS.textDark },
  homeBtn:          { padding: 4, marginLeft: 4 },

  heroBanner:       { backgroundColor: COLORS.white, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 12, marginBottom: 0 },
  heroTitle:        { fontFamily: 'Hana2-Bold', fontSize: 22, color: COLORS.textDark, lineHeight: 32, marginBottom: 20 },
  heroValueRow:     { flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#E6F7F3', borderRadius: 16, paddingHorizontal: 22, paddingVertical: 26 },
  heroValueLabel:   { fontFamily: 'Hana2-Medium', fontSize: 14, color: '#6B7280' },
  heroValueAmount:  { fontFamily: 'Hana2-Bold', fontSize: 32, color: '#008465', marginTop: 6 },

  filterRow:        { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8, gap: 8, backgroundColor: COLORS.white, marginBottom: 4 },
  filterTab:        { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0' },
  filterTabActive:  { backgroundColor: '#05A68B' },
  filterLabel:      { fontFamily: 'Hana2-Medium', fontSize: 13, color: COLORS.textGray },
  filterLabelActive:{ color: COLORS.white },

  grid:             { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16, overflow: 'visible' },

  card:             {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.2,
    borderColor: '#E6EDE9',
  },
  cardUsed:         { opacity: 0.5 },

  tagBadge:         { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 10 },
  tagText:          { fontFamily: 'Hana2-Bold', fontSize: 11, overflow: 'hidden' },

  cardEmoji:        { fontSize: 44, textAlign: 'center', marginBottom: 14 },
  cardImage:        { width: 88, height: 88, alignSelf: 'center', marginBottom: 14 },

  cardTitle:        { fontFamily: 'Hana2-Bold', fontSize: 15, color: COLORS.textDark, lineHeight: 22, marginBottom: 6 },
  cardDesc:         { fontFamily: 'Hana2-Regular', fontSize: 12, color: '#6B7280', lineHeight: 18 },

  bottom:           { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12, gap: 12, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  mainBtn:          { backgroundColor: '#05A68B', borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  mainBtnText:      { fontFamily: 'Hana2-Bold', fontSize: 16, color: COLORS.white },
  helpText:         { fontFamily: 'Hana2-Regular', fontSize: 13, color: COLORS.textGray, textAlign: 'center' },
});
