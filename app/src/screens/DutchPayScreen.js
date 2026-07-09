import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { COLORS } from '../constants/colors';
import BottomTabBar from '../components/BottomTabBar';
import appStore from '../utils/appStore';

export default function DutchPayScreen({ navigation }) {
  const balance = appStore.balance;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR 더치페이</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* QR 영역 */}
      <View style={styles.qrSection}>
        <View style={styles.qrFrame}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <Image
            source={require('../../assets/bitamin-qr.png')}
            style={styles.qrImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.qrCaption}>QR코드를 스캔하세요</Text>
      </View>

      {/* 잔액 */}
      <View style={styles.balanceRow}>
        <View>
          <Text style={styles.balanceLabel}>현재 잔액</Text>
          <Text style={styles.balanceAmount}>₩ {balance.toLocaleString('ko-KR')}</Text>
        </View>
        <TouchableOpacity style={styles.chargeBtn} onPress={() => navigation.navigate('Charge')}>
          <Text style={styles.chargeBtnText}>충전하기</Text>
        </TouchableOpacity>
      </View>

      {/* 최근 정산 내역 */}
      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>최근 정산 내역</Text>
      </View>

      <BottomTabBar activeTab="home" navigation={navigation} balance={balance} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backBtn: { width: 40, paddingLeft: 4 },
  backBtnText: { fontSize: 20, color: COLORS.textDark },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Hana2-Bold',
    fontSize: 17,
    color: COLORS.textDark,
  },

  qrSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 36,
  },
  qrFrame: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 190,
    height: 190,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: COLORS.primary,
  },
  cornerTL: { top: 0, left: 0,  borderTopWidth: 3, borderLeftWidth: 3,  borderTopLeftRadius: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  cornerBL: { bottom: 0, left: 0,  borderBottomWidth: 3, borderLeftWidth: 3,  borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },
  qrCaption: {
    marginTop: 16,
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: COLORS.textGray,
  },

  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  balanceLabel: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: 'Hana2-Bold',
    fontSize: 28,
    color: COLORS.primary,
    letterSpacing: -1,
  },
  chargeBtn: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  chargeBtnText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 14,
    color: COLORS.primary,
  },

  historyCard: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
  },
  historyTitle: {
    fontFamily: 'Hana2-Medium',
    fontSize: 14,
    color: COLORS.textGray,
  },
});
