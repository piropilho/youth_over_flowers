import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import BottomTabBar from '../components/BottomTabBar';
import appStore from '../utils/appStore';

export default function MyCardScreen({ navigation }) {
  const [balance] = useState(() => appStore.balance);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={COLORS.textDark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Card</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.homeBtn}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M3 11.5L12 3l9 8.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z" stroke={COLORS.textDark} strokeWidth={1.8} fill="none" />
            <Path d="M9 22V12h6v10" stroke={COLORS.textDark} strokeWidth={1.8} />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 카드 이미지 */}
        <View style={styles.cardWrap}>
          <Image
            source={require('../../assets/card.png')}
            style={styles.cardImage}
            resizeMode="contain"
          />
        </View>

        {/* 잔액 */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>잔액</Text>
          <Text style={styles.balanceAmount}>₩ {balance.toLocaleString('ko-KR')}</Text>
        </View>

        {/* 최근 거래 내역 */}
        <Text style={styles.historyTitle}>최근 거래 내역</Text>
      </ScrollView>

      <View style={styles.emptyWrap}>
        <Text style={styles.historyEmpty}>거래 내역 없음</Text>
      </View>

      <BottomTabBar activeTab="my" navigation={navigation} balance={balance} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: { padding: 4, width: 36 },
  homeBtn: { padding: 4, width: 36, alignItems: 'flex-end' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Hana2-Bold',
    fontSize: 17,
    color: COLORS.textDark,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  cardWrap: {
    marginTop: 16,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },

  balanceCard: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 4,
  },
  balanceLabel: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.textGray,
  },
  balanceAmount: {
    fontFamily: 'Hana2-Bold',
    fontSize: 26,
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },

  historyTitle: {
    marginTop: 24,
    fontFamily: 'Hana2-Medium',
    fontSize: 16,
    color: COLORS.textDark,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -400
  },
  historyEmpty: {
    fontFamily: 'Hana2-Regular',
    fontSize: 20,
    color: '#BDBDBD',
  },
});
