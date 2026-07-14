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
import { COLORS } from '../constants/colors';
import BottomTabBar from '../components/BottomTabBar';

export default function DutchPayScreen({ navigation, route }) {
  const {
    totalAmount = 55500,
    people = 3,
    perPerson = 18500,
  } = route.params ?? {};

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

      <ScrollView showsVerticalScrollIndicator={false}>

      {/* QR 영역 */}
      <View style={styles.qrSection}>
        {/* 정산 정보 컨테이너 */}
        <View style={styles.settlementCard}>
          <Text style={styles.settlementSubtitle}>총 ₩{totalAmount.toLocaleString('ko-KR')} · {people}명</Text>
          <Text style={styles.settlementAmount}>인당 ₩{perPerson.toLocaleString('ko-KR')}</Text>
        </View>

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
        <Text style={styles.qrCaption}>친구에게 이 QR을 보여주면 정산 금액이 바로 송금돼요 💸</Text>
      </View>

      {/* 최근 정산 내역 */}
      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>최근 정산 내역</Text>
      </View>

      </ScrollView>

      <BottomTabBar activeTab="home" navigation={navigation} />
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
    paddingTop: 24,
    paddingBottom: 28,
  },
  settlementCard: {
    backgroundColor: '#F0FAF6',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  settlementSubtitle: {
    fontFamily: 'Hana2-Medium',
    fontSize: 16,
    color: '#6B7280',
  },
  settlementAmount: {
    fontFamily: 'Hana2-Bold',
    fontSize: 30,
    color: '#008465',
    letterSpacing: -1,
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
    borderColor: '#05A68B',
  },
  cornerTL: { top: 0, left: 0,  borderTopWidth: 3, borderLeftWidth: 3,  borderTopLeftRadius: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  cornerBL: { bottom: 0, left: 0,  borderBottomWidth: 3, borderLeftWidth: 3,  borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },
  qrCaption: {
    marginTop: 16,
    fontFamily: 'Hana2-Regular',
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 21,
  },

  historyCard: {
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
  },
  historyTitle: {
    fontFamily: 'Hana2-Medium',
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  historyDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  historyName: {
    fontFamily: 'Hana2-Regular',
    fontSize: 14,
    color: COLORS.textDark,
  },
  historyAmountDone: {
    fontFamily: 'Hana2-Bold',
    fontSize: 14,
    color: '#05A68B',
  },
  historyAmountPending: {
    fontFamily: 'Hana2-Medium',
    fontSize: 14,
    color: '#9CA3AF',
  },
});
