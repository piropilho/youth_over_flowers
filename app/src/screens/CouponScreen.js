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
import BottomTabBar from '../components/BottomTabBar';
import appStore from '../utils/appStore';

const BENEFITS = [
  {
    id: 'insurance',
    title: '여행자 보험',
    desc: '한국 여행 중 예상치 못한 일이 발생해도 든든한 보험',
    badge: '하나손해보험',
    status: 'available',
  },
  {
    id: 'esim',
    title: 'eSIM 제공',
    desc: '한국 여행시 어디서든 빠른 인터넷 사용위한 서비스',
    badge: null,
    status: 'available',
  },
  {
    id: 'lounge',
    title: '공항 라운지 이용권',
    desc: '귀국시 공항 대기시간을 편하게!',
    badge: null,
    status: 'available',
  },
  {
    id: 'smallbiz',
    title: '소상공인 매장 방문 할인쿠폰',
    desc: '한국의 골목상권 매장에서 쓸 수 있는 할인쿠폰',
    badge: null,
    status: 'available',
  },
  {
    id: 'dutyfree',
    title: '면세점 할인쿠폰',
    desc: '출국 전, 면세점 쇼핑을 더 알뜰하게!',
    badge: null,
    status: 'used',
  },
];

const FILTERS = [
  { key: 'all',       label: '전체' },
  { key: 'available', label: '사용 가능' },
  { key: 'used',      label: '사용 완료' },
];

export default function CouponScreen({ navigation }) {
  const balance = appStore.balance;
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
          <Text style={styles.headerTitle}>혜택 보기</Text>
          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M3 11.5L12 3l9 8.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z" stroke={COLORS.textDark} strokeWidth={1.8} fill="none" />
              <Path d="M9 22V12h6v10" stroke={COLORS.textDark} strokeWidth={1.8} />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Filter tabs */}
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

        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.map((b, i) => (
            <TouchableOpacity key={b.id} style={styles.item} activeOpacity={0.7}>
              <View style={styles.itemContent}>
                <View style={styles.titleRow}>
                  <Text style={[styles.itemTitle, b.status === 'used' && styles.itemTitleUsed]}>
                    {b.title}
                  </Text>
                  {b.badge && (
                    <Image
                      source={require('../../assets/hana-insurance.png')}
                      style={styles.badgeImg}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <Text style={[styles.itemDesc, b.status === 'used' && styles.itemDescUsed]}>
                  {b.desc}
                </Text>
                {b.status === 'used' && (
                  <Text style={styles.usedLabel}>사용 완료</Text>
                )}
              </View>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M9 6l6 6-6 6" stroke={b.status === 'used' ? '#BDBDBD' : COLORS.textDark} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom */}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    padding: 4,
    marginRight: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Hana2-Bold',
    fontSize: 17,
    color: COLORS.textDark,
  },
  homeBtn: {
    padding: 4,
    marginLeft: 4,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterLabel: {
    fontFamily: 'Hana2-Medium',
    fontSize: 13,
    color: COLORS.textGray,
  },
  filterLabelActive: {
    color: COLORS.white,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 10,
  },
  itemContent: {
    flex: 1,
    marginRight: 8,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  itemTitle: {
    fontFamily: 'Hana2-Bold',
    fontSize: 15,
    color: COLORS.textDark,
  },
  itemTitleUsed: {
    color: '#BDBDBD',
  },
  badgeImg: {
    height: 20,
    width: 80,
  },
  itemDesc: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.textGray,
    lineHeight: 18,
  },
  itemDescUsed: {
    color: '#BDBDBD',
  },
  usedLabel: {
    fontFamily: 'Hana2-Regular',
    fontSize: 11,
    color: '#BDBDBD',
    marginTop: 2,
  },
  bottom: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
    gap: 12,
  },
  mainBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  mainBtnText: {
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
