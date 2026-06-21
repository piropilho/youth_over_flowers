import React, { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const TAB_ITEMS = [
  { key: 'home', label: '홈' },
  { key: 'pay', label: '결제' },
  { key: 'recommend', label: '추천' },
  { key: 'transport', label: '교통' },
  { key: 'my', label: '마이' },
];

function TabIcon({ name, active }) {
  const color = active ? COLORS.primary : '#BDBDBD';
  if (name === 'home') return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11.5L12 3l9 8.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z" stroke={color} strokeWidth={1.8} fill={active ? color : 'none'} />
      <Path d="M9 22V12h6v10" stroke={active ? COLORS.white : color} strokeWidth={1.8} />
    </Svg>
  );
  if (name === 'pay') return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth={1.8} />
      <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth={1.8} />
      <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth={1.8} />
      <Rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
  if (name === 'recommend') return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
  if (name === 'transport') return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="2" width="14" height="16" rx="3" stroke={color} strokeWidth={1.8} />
      <Path d="M5 10h14" stroke={color} strokeWidth={1.8} />
      <Circle cx="8.5" cy="16" r="1.5" fill={color} />
      <Circle cx="15.5" cy="16" r="1.5" fill={color} />
      <Path d="M8 20l-2 2M16 20l2 2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
  if (name === 'my') return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C12 21 4 15.5 4 9.5a4.5 4.5 0 019-0c.1-.1.2-.2.3-.3A4.5 4.5 0 0121 9.5C21 15.5 12 21 12 21z" stroke={color} strokeWidth={1.8} fill={active ? color : 'none'} />
    </Svg>
  );
  return null;
}

function parseTravelDate(str) {
  const [y, m, d] = str.replace(/\s/g, '').split('-').map(Number);
  return new Date(y, m - 1, d);
}

export default function HomeScreen({ navigation, route }) {
  const userName = '朴必鎬';
  const departDate = route.params?.departDate ?? null;
  const returnDate = route.params?.returnDate ?? null;

  const dDay = useMemo(() => {
    if (!departDate) return null;
    const depart = parseTravelDate(departDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    depart.setHours(0, 0, 0, 0);
    return Math.ceil((depart - today) / (1000 * 60 * 60 * 24));
  }, [departDate]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image source={require('../../assets/hana-symbol.png')} style={styles.logoIcon} resizeMode="contain" />
          <Text style={styles.logoText}>HANA <Text style={{ color: '#E90061' }}>EZPZ</Text></Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M15 17h5l-1.4-1.4A2 2 0 0118 14V11a6 6 0 00-4-5.66V5a2 2 0 00-4 0v.34A6 6 0 006 11v3a2 2 0 01-.6 1.4L4 17h5m6 0H9m6 0a3 3 0 01-6 0" stroke={COLORS.textDark} strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Welcome */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeRow}>
          <View style={styles.welcomeTextCol}>
            <Text style={styles.welcomeName}>{userName} 님,</Text>
            <View style={styles.welcomeTitleRow}>
              <Text style={styles.welcomeTitle}>한국 여행을 환영해요! </Text>
              <Image source={require('../../assets/korea.png')} style={styles.koreaFlag} resizeMode="contain" />
            </View>
            <Text style={styles.welcomeSub}>Welcome to Korea</Text>
          </View>
          <Image
            source={require('../../assets/별돌이_찰칵.png')}
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
      <LinearGradient
        colors={['#EEEEEE', '#6FCF97', '#2FA084', '#1F6F5F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.cardTopRow}>
          <View>
            <Text style={styles.balanceLabel}>내 잔액</Text>
            <Text style={styles.balanceAmount}>₩ 0</Text>
            <Text style={styles.balanceYen}>≈ ¥0</Text>
          </View>
          <TouchableOpacity style={styles.chargeBtn}>
            <Text style={styles.chargeBtnText}>+ 충전</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.remaining}>₩0 남음</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
              <Rect x="3" y="3" width="7" height="7" rx="1" stroke={COLORS.primary} strokeWidth={2} />
              <Rect x="14" y="3" width="7" height="7" rx="1" stroke={COLORS.primary} strokeWidth={2} />
              <Rect x="3" y="14" width="7" height="7" rx="1" stroke={COLORS.primary} strokeWidth={2} />
              <Rect x="14" y="14" width="7" height="7" rx="1" stroke={COLORS.primary} strokeWidth={2} />
            </Svg>
            <Text style={styles.actionBtnText}>QR 결제</Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity style={styles.actionBtn}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
              <Path d="M4 6h16M4 12h10M4 18h7" stroke={COLORS.primary} strokeWidth={2} strokeLinecap="round" />
            </Svg>
            <Text style={styles.actionBtnText}>더치페이</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Schedule Section */}
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

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {TAB_ITEMS.map((tab) => {
          const active = tab.key === 'home';
          return (
            <TouchableOpacity key={tab.key} style={styles.tabItem}>
              <TabIcon name={tab.key} active={active} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
  },
  logoText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 17,
    color: COLORS.primary,
  },
  bellBtn: {
    padding: 4,
  },
  welcomeSection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeTextCol: {
    flex: 1,
  },
  welcomeImage: {
    width: 115,
    height: 115,
  },
  welcomeName: {
    fontFamily: 'Hana2-Regular',
    fontSize: 22,
    color: COLORS.textDark,
  },
  welcomeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  welcomeTitle: {
    fontFamily: 'Hana2-Bold',
    fontSize: 22,
    color: COLORS.textDark,
  },
  koreaFlag: {
    width: 26,
    height: 26,
  },
  welcomeSub: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: COLORS.textGray,
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
    color: COLORS.textGray,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  balanceLabel: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: 'Hana2-Bold',
    fontSize: 32,
    color: COLORS.textDark,
    letterSpacing: -1,
  },
  balanceYen: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },
  chargeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chargeBtnText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 13,
    color: COLORS.white,
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
    borderRadius: 12,
    overflow: 'hidden',
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
  scheduleSection: {
    flex: 1,
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontFamily: 'Hana2-Regular',
    fontSize: 11,
    color: '#BDBDBD',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontFamily: 'Hana2-Medium',
  },
});
