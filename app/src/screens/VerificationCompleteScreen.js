import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { COLORS } from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';

const VERIFIED_ITEMS = ['여권 인증', '안면 인식'];

export default function VerificationCompleteScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>본인 인증</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>본인 인증이 완료되었어요!</Text>
        <Text style={styles.subtitle}>eKYC verification completed</Text>

        <View style={styles.spacer}>
          <Image
            source={require('../../assets/yaaaaaho.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Info Card */}
        <View style={{ height: 24 }} />
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>인증 정보</Text>
            <Text style={styles.cardStatus}>eKYC 인증 완료 ✓</Text>
          </View>
          <View style={styles.divider} />
          {VERIFIED_ITEMS.map((item, i) => (
            <View key={i} style={styles.cardRow}>
              <Text style={styles.checkMark}>✓</Text>
              <Text style={styles.cardRowText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <AnimatedButton style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>로그인하러 가기</Text>
        </AnimatedButton>
        <TouchableOpacity>
          <Text style={styles.helpText}>도움이 필요하신가요? 지원센터 문의</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    paddingTop: 4,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontSize: 32,
    color: COLORS.textDark,
    lineHeight: 34,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Hana2-Bold',
    color: COLORS.textDark,
    zIndex: -1,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Hana2-Bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Hana2-Regular',
    color: COLORS.textGray,
    marginBottom: 30,
  },
  spacer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: '70%',
    height: '100%',
  },
  card: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  cardLabel: {
    fontFamily: 'Hana2-Bold',
    fontSize: 13,
    color: COLORS.textGray,
  },
  cardStatus: {
    fontFamily: 'Hana2-Bold',
    fontSize: 13,
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 13,
    gap: 10,
  },
  checkMark: {
    fontFamily: 'Hana2-Bold',
    fontSize: 13,
    color: COLORS.primary,
  },
  cardRowText: {
    fontFamily: 'Hana2-Regular',
    fontSize: 14,
    color: COLORS.textDark,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
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
