import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import { COLORS } from '../constants/colors';
import BottomTabBar from '../components/BottomTabBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MARGIN = 24;
const CAM_SIZE = SCREEN_WIDTH - MARGIN * 2;
const OVERLAY = 'rgba(0,0,0,0.55)';

export default function QRPayDemoScreen({ navigation, route }) {
  const [tab, setTab] = useState('scan');
  const scanAnim = useRef(new Animated.Value(0)).current;
  const balance = route.params?.balance ?? 0;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0,    useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scanY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, CAM_SIZE - 2],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 데모 배경 이미지 */}
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <Image
          source={require('../../assets/qr-demo-pic.png')}
          style={{ width: '100%', height: '100%', transform: [{ scale: 1.15 }, { translateY: -55 }] }}
          resizeMode="contain"
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* 상단 반투명 오버레이: 헤더 + 세그먼트 */}
        <View style={styles.topOverlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backBtnText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>QR 결제</Text>
          </View>
          <View style={styles.segWrapper}>
            <TouchableOpacity
              style={[styles.segTab, tab === 'scan' && styles.segTabActive]}
              onPress={() => setTab('scan')}
              activeOpacity={0.8}
            >
              <Text style={[styles.segLabel, tab === 'scan' && styles.segLabelActive]}>QR 스캔</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segTab, tab === 'myqr' && styles.segTabActive]}
              onPress={() => setTab('myqr')}
              activeOpacity={0.8}
            >
              <Text style={[styles.segLabel, tab === 'myqr' && styles.segLabelActive]}>내 QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 스캔 영역 */}
        <View style={styles.scanRow}>
          <View style={styles.sideDark} />
          <View style={{ width: CAM_SIZE, height: CAM_SIZE }}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            {tab === 'scan' && (
              <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanY }] }]} />
            )}
            {tab === 'myqr' && (
              <Image
                source={require('../../assets/bitamin-qr.png')}
                style={{ position: 'absolute', width: CAM_SIZE - 32, height: CAM_SIZE - 32, top: 16, left: 16 }}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={styles.sideDark} />
        </View>

        {/* 하단 반투명 오버레이: 캡션 + 잔액 */}
        <View style={styles.bottomOverlay}>
          <Text style={styles.caption}>
            {tab === 'scan' ? 'QR코드를 스캔하세요' : '바코드를 제시하여 결제하세요'}
          </Text>
          <View style={styles.balanceRow}>
            <View>
              <Text style={styles.balanceLabel}>현재 잔액</Text>
              <Text style={styles.balanceAmount}>₩ {balance.toLocaleString('ko-KR')}</Text>
            </View>
            <TouchableOpacity style={styles.chargeBtn} onPress={() => navigation.navigate('Charge')}>
              <Text style={styles.chargeBtnText}>충전하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        <BottomTabBar activeTab="qr" navigation={navigation} balance={balance} dark minimal />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safeArea:  { flex: 1 },

  topOverlay: { backgroundColor: OVERLAY },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backBtn:     { paddingHorizontal: 16, paddingVertical: 6 },
  backBtnText: { fontSize: 20, color: '#fff' },
  headerTitle: {
    position: 'absolute', left: 0, right: 0, textAlign: 'center',
    fontFamily: 'Hana2-Bold', fontSize: 17, color: '#fff', zIndex: -1,
  },
  segWrapper: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 4,
  },
  segTab:         { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  segTabActive:   { backgroundColor: '#05A68B' },
  segLabel:       { fontFamily: 'Hana2-Medium', fontSize: 14, color: 'rgba(255,255,255,0.55)' },
  segLabelActive: { color: '#fff', fontFamily: 'Hana2-Bold' },

  scanRow:  { flexDirection: 'row', height: CAM_SIZE },
  sideDark: { flex: 1, backgroundColor: OVERLAY },

  corner:   { position: 'absolute', width: 30, height: 30, borderColor: '#05A68B' },
  cornerTL: { top: 8, left: 8, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  cornerTR: { top: 8, right: 8, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  cornerBL: { bottom: 8, left: 8, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 8, right: 8, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },

  scanLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: '#05A68B',
    shadowColor: '#05A68B',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },

  bottomOverlay: {
    flex: 1,
    backgroundColor: OVERLAY,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  caption: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginBottom: 24,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontFamily: 'Hana2-Bold',
    fontSize: 28,
    color: '#fff',
    letterSpacing: -1,
  },
  chargeBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  chargeBtnText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 14,
    color: '#fff',
  },
});
