import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Modal,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function ChargeSuccessScreen({ route, navigation }) {
  const { krw = 0, foreignAmount = 0, currencySymbol = '$' } = route.params ?? {};

  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1,
        tension: 80,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => setModalVisible(true), 500);
    });
  }, []);

  const krwFormatted     = Math.round(krw).toLocaleString('ko-KR');
  const foreignFormatted = foreignAmount.toLocaleString('ko-KR');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* 성공 아이콘 영역 */}
        <View style={styles.heroSection}>
          <Animated.Image
            source={require('../../assets/success.png')}
            style={[styles.successImg, { transform: [{ scale }] }]}
            resizeMode="contain"
          />
          <Animated.View style={{ alignItems: 'center', opacity }}>
            <Text style={styles.successTitle}>충전이 완료됐어요!</Text>
            <Text style={styles.successSub}>잔액이 안전하게 충전됐습니다</Text>
          </Animated.View>
        </View>

        {/* 충전 금액 카드 */}
        <Animated.View style={[styles.amountCard, { opacity }]}>
          <Text style={styles.amountLabel}>충전 금액</Text>
          <Text style={styles.amountMain}>₩ {krwFormatted}</Text>
          <Text style={styles.amountSub}>≈ {currencySymbol}{foreignFormatted}</Text>
        </Animated.View>

      </ScrollView>

      {/* 하단 CTA */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.subBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Coupon')}
        >
          <Text style={styles.subBtnText}>혜택 상세보기 →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mainBtn}
          activeOpacity={0.85}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
        >
          <Text style={styles.mainBtnText}>확인</Text>
        </TouchableOpacity>
      </View>

      {/* 혜택 달성 팝업 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalHeader}>특별 혜택 달성!</Text>
            <Text style={styles.modalCondition}>여행 2주 전, 50만원 이상 선불 충전 완료</Text>
            <TouchableOpacity
              style={styles.modalBtn}
              activeOpacity={0.85}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Coupon');
              }}
            >
              <Text style={styles.modalBtnText}>혜택 받으러 가기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.white },
  scroll:       { paddingBottom: 16 },

  heroSection:  { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  successImg:   { width: 150, height: 150, marginBottom: 28 },
  successTitle: { fontFamily: 'Hana2-Bold', fontSize: 24, color: COLORS.textDark, marginBottom: 8 },
  successSub:   { fontFamily: 'Hana2-Regular', fontSize: 14, color: '#9CA3AF' },

  amountCard:   {
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: '#F2F9F6', borderRadius: 18,
    paddingVertical: 28, paddingHorizontal: 24,
    alignItems: 'center',
  },
  amountLabel:  { fontFamily: 'Hana2-Medium', fontSize: 13, color: '#9CA3AF', letterSpacing: 0.3, marginBottom: 10 },
  amountMain:   { fontFamily: 'Hana2-Bold', fontSize: 38, color: COLORS.textDark, letterSpacing: -1.5, marginBottom: 6 },
  amountSub:    { fontFamily: 'Hana2-Regular', fontSize: 15, color: '#008465' },

  bottom:       { paddingHorizontal: 20, paddingBottom: 28, paddingTop: 8, gap: 4 },
  subBtn:       { alignItems: 'center', paddingVertical: 12 },
  subBtnText:   { fontFamily: 'Hana2-Medium', fontSize: 14, color: '#008465' },
  mainBtn:      { backgroundColor: '#05A68B', borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  mainBtnText:  { fontFamily: 'Hana2-Bold', fontSize: 16, color: COLORS.white },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modalClose:     { position: 'absolute', top: 14, right: 14, padding: 4 },
  modalCloseText: { fontSize: 18, color: '#9CA3AF' },
  modalEmoji:     { fontSize: 40, marginBottom: 14 },
  modalHeader:    { fontFamily: 'Hana2-Bold', fontSize: 18, color: '#008465', textAlign: 'center', marginBottom: 12 },
  modalCondition: {
    fontFamily: 'Hana2-Bold', fontSize: 14, color: '#374151',
    backgroundColor: '#F2F9F6', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 14,
    textAlign: 'center', overflow: 'hidden',
    marginBottom: 20, alignSelf: 'stretch',
  },
  modalMessage:   { fontFamily: 'Hana2-Bold', fontSize: 16, color: '#111827', textAlign: 'center', marginBottom: 24 },
  modalBtn:       {
    backgroundColor: '#05A68B', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', alignSelf: 'stretch',
  },
  modalBtnText:   { fontFamily: 'Hana2-Bold', fontSize: 15, color: COLORS.white },
});
