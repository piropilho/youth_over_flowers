import React, { useMemo, useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import pendingCharge from '../utils/pendingCharge';
import appStore from '../utils/appStore';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import BottomTabBar from '../components/BottomTabBar';

const NEARBY_PLACES = [
  { icon: '🐟', name: '가락시장 대박수산',    subName: '(Dae-bak Fishery)',       walk: 3, dist: 250, rating: 4.8, badge: '전통시장', badgeBg: '#BDE4DC', badgeColor: '#1A7A60' },
  { icon: '🍜', name: '방이시장 원조국수',    subName: '(Wonjong Noodle House)',  walk: 7, dist: 580, rating: 4.6, badge: '로컬맛집', badgeBg: '#F5EDD8', badgeColor: '#A07840' },
  { icon: '🌶️', name: '방이시장 시장떡볶이', subName: '(Sijang Tteokbokki)',     walk: 9, dist: 720, rating: 4.5, badge: '로컬맛집', badgeBg: '#E8F5F0', badgeColor: '#1A7A60' },
];

function parseTravelDate(str) {
  const [y, m, d] = str.replace(/\s/g, '').split('-').map(Number);
  return new Date(y, m - 1, d);
}

export default function HomeScreen({ navigation, route }) {
  const userName = '朴必鎬';

  const [departDate, setDepartDate] = useState(() => appStore.departDate);
  const [returnDate, setReturnDate] = useState(() => appStore.returnDate);
  const [balance, setBalance] = useState(() => appStore.balance);
  const [isInKorea, setIsInKorea] = useState(false);

  useEffect(() => {
    if (route.params?.departDate) {
      setDepartDate(route.params.departDate);
      appStore.departDate = route.params.departDate;
    }
    if (route.params?.returnDate) {
      setReturnDate(route.params.returnDate);
      appStore.returnDate = route.params.returnDate;
    }
  }, [route.params?.departDate, route.params?.returnDate]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (pendingCharge.krw > 0) {
        setBalance(prev => {
          const next = prev + pendingCharge.krw;
          appStore.balance = next;
          return next;
        });
        pendingCharge.krw = 0;
      }
    });
    return unsubscribe;
  }, [navigation]);

  const dDay = useMemo(() => {
    if (!departDate) return null;
    const depart = parseTravelDate(departDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    depart.setHours(0, 0, 0, 0);
    return Math.ceil((depart - today) / (1000 * 60 * 60 * 24));
  }, [departDate]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#059669', '#34D399']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
      {/* 배경 태극 문양 워터마크 */}
      <Svg width={320} height={320} viewBox="0 0 200 200" style={styles.bgPattern}>
        {/* 태극 원형 외곽 */}
        <Path d="M100 10 A90 90 0 1 1 99.999 10 Z" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} fill="none" />
        {/* 태극 S-curve */}
        <Path d="M100 10 A45 45 0 0 1 100 100 A45 45 0 0 0 100 190 A90 90 0 0 1 100 10 Z" fill="rgba(255,255,255,0.05)" />
      </Svg>
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        {/* 좌측: 로고 */}
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setIsInKorea(v => !v)} activeOpacity={1}>
            <Image source={require('../../assets/hana-logo-white-remove.png')} style={styles.logoIcon} resizeMode="contain" />
          </TouchableOpacity>
          {isInKorea && (
            <View style={styles.inKoreaBadge}>
              <Text style={styles.inKoreaBadgeText}>KOREA</Text>
            </View>
          )}
        </View>
        {/* 우측: 벨 */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.bellBtn}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M15 17h5l-1.4-1.4A2 2 0 0118 14V11a6 6 0 00-4-5.66V5a2 2 0 00-4 0v.34A6 6 0 006 11v3a2 2 0 01-.6 1.4L4 17h5m6 0H9m6 0a3 3 0 01-6 0" stroke="#F5F5F7" strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeRow}>
          <View style={styles.welcomeTextCol}>
            <Text style={styles.welcomeName}>{userName} 님,</Text>
            <Text style={styles.welcomeTitle}>한국 여행을{'\n'}환영해요!</Text>
            <Text style={styles.welcomeSub}>Welcome to Korea</Text>
          </View>
          <Image
            source={require('../../assets/byuldol-capture.png')}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Travel Date Card */}
      {departDate && returnDate && (
        <>
          <View style={styles.travelDateCard}>
            <View>
              <Text style={styles.travelDateText}>{departDate}</Text>
              <Text style={styles.travelDateText}>~ {returnDate}</Text>
            </View>
            <View style={styles.dDayBadge}>
              <Text style={styles.dDayText}>
                {dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-Day' : `D+${Math.abs(dDay)}`}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.reSelectBtn}
            onPress={() => navigation.navigate('TravelPlan', { initialDepartDate: departDate, initialReturnDate: returnDate })}
            activeOpacity={0.6}
          >
            <Text style={styles.reSelectText}>← 일정 다시 선택하기</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Balance Card */}
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.balanceLabel}>내 잔액</Text>
          <Text style={styles.balanceAmount}>₩ {balance.toLocaleString('ko-KR')}</Text>

          <TouchableOpacity style={styles.chargeBtn} onPress={() => navigation.navigate('Charge')} activeOpacity={0.85}>
            <Text style={styles.chargeBtnText}>+ 충전하기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('QRPay', { balance })}>
            <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" style={{ marginRight: 5 }}>
              <Rect x="3" y="3" width="7" height="7" rx="1" stroke={COLORS.primary} strokeWidth={2} />
              <Rect x="14" y="3" width="7" height="7" rx="1" stroke={COLORS.primary} strokeWidth={2} />
              <Rect x="3" y="14" width="7" height="7" rx="1" stroke={COLORS.primary} strokeWidth={2} />
              <Rect x="14" y="14" width="7" height="7" rx="1" stroke={COLORS.primary} strokeWidth={2} />
            </Svg>
            <Text style={styles.actionBtnText}>QR 결제</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('DutchPay')}>
            <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" style={{ marginRight: 5 }}>
              <Path d="M4 6h16M4 12h10M4 18h7" stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionBtnText}>더치페이</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Schedule / Nearby Section */}
      {isInKorea ? (
        <View style={styles.nearbySection}>
          <View style={styles.nearbyHeader}>
            <Text style={styles.nearbyTitle}>📍 실시간 내 주변 로컬 탐방</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
              <Text style={styles.nearbyMore}>전체보기 →</Text>
            </TouchableOpacity>
          </View>
          {NEARBY_PLACES.map((place, i) => (
            <TouchableOpacity key={i} style={styles.nearbyItem} activeOpacity={0.7}>
              <View style={styles.nearbyIconBox}>
                <Text style={styles.nearbyIcon}>{place.icon}</Text>
              </View>
              <View style={styles.nearbyInfo}>
                <Text style={styles.nearbyName}>{place.name}</Text>
                <Text style={styles.nearbySubName}>{place.subName}</Text>
                <Text style={styles.nearbyMeta}>도보 {place.walk}분 ({place.dist}m) · ★ {place.rating}</Text>
              </View>
              <View style={[styles.nearbyBadge, { backgroundColor: place.badgeBg }]}>
                <Text style={[styles.nearbyBadgeText, { color: place.badgeColor }]}>{place.badge}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.scheduleSection}>
          {departDate ? (
            <Text style={styles.scheduleEmpty}>아직 여행이 시작되지 않았어요</Text>
          ) : (
            <>
              <Text style={styles.scheduleEmpty}>아직 여행 일정이 입력되지 않았어요</Text>
              <TouchableOpacity style={styles.scheduleBtn} onPress={() => navigation.navigate('TravelPlan')}>
                <Text style={styles.scheduleBtnText}>여행계획 세우러 가기 →</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      </ScrollView>
    </SafeAreaView>
    <BottomTabBar activeTab="home" navigation={navigation} balance={balance} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bgPattern: {
    position: 'absolute',
    right: -40,
    top: 20,
    opacity: 1,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 22,
    height: 22,
  },
  logoText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  bellBtn: {
    padding: 4,
  },
  inKoreaBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  inKoreaBadgeText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 12,
    color: '#fff',
  },
  welcomeSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  welcomeTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  welcomeImage: {
    width: 160,
    height: 160,
    marginBottom: -8,
  },
  welcomeName: {
    fontFamily: 'Hana2-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 6,
    lineHeight: 22,
  },
  welcomeTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  welcomeTitle: {
    fontFamily: 'Hana2-Bold',
    fontSize: 34,
    color: COLORS.white,
    lineHeight: 44,
    flex: 1,
  },
  koreaFlag: {
    width: 24,
    height: 24,
    marginTop: 4,
    marginLeft: 4,
  },
  welcomeSub: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.8,
  },
  travelDateCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  travelDateText: {
    fontFamily: 'Hana2-Regular',
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 22,
  },
  dDayBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dDayText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  reSelectBtn: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 6,
  },
  reSelectText: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.white,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  cardBody: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    alignItems: 'center',
  },
  balanceLabel: {
    fontFamily: 'Hana2-Medium',
    fontSize: 15,
    color: '#6B7280',
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  balanceAmount: {
    fontFamily: 'Hana2-Bold',
    fontSize: 38,
    color: COLORS.textDark,
    letterSpacing: -1.5,
    marginBottom: 28,
  },
  balanceYen: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 6,
    marginBottom: 28,
  },
  chargeBtn: {
    backgroundColor: '#00B488',
    borderRadius: 9999,
    height: 44,
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chargeBtnText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 14,
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: {
    width: '0%',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  remaining: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.textGray,
    textAlign: 'right',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    borderTopWidth: 1,
    borderTopColor: '#E0F2EE',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#B2DFDB',
    marginVertical: 10,
  },
  actionBtnText: {
    fontFamily: 'Hana2-Medium',
    fontSize: 13,
    color: COLORS.primary,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  scheduleSection: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  scheduleEmpty: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: COLORS.textGray,
    textAlign: 'center',
  },
  scheduleBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  scheduleBtnText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 15,
    color: COLORS.white,
  },
  nearbySection: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  nearbyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nearbyTitle: {
    fontFamily: 'Hana2-Bold',
    fontSize: 17,
    color: COLORS.textDark,
  },
  nearbySub: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.textGray,
  },
  nearbyMore: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 2,
  },
  nearbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F4',
    gap: 12,
  },
  nearbyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#E8F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearbyIcon: { fontSize: 26 },
  nearbyInfo: { flex: 1 },
  nearbyName: {
    fontFamily: 'Hana2-Bold',
    fontSize: 15,
    color: COLORS.textDark,
    marginBottom: 2,
  },
  nearbySubName: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 3,
  },
  nearbyMeta: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.textGray,
  },
  nearbyBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  nearbyBadgeText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 12,
  },
});
