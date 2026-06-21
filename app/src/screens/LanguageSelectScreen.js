import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AppText from '../components/AppText';
import AnimatedButton from '../components/AnimatedButton';
import CountryFlag from 'react-native-country-flag';
import { COLORS } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const LANGUAGES = [
  { id: 'zh-CN', label: '中文 (简体)', sub: 'Chinese Simplified', isoCode: 'CN' },
  { id: 'ja',    label: '日本語',      sub: 'Japanese',           isoCode: 'JP' },
  { id: 'ko',    label: '한국어',       sub: 'Korean',              isoCode: 'KR' },
  { id: 'en',    label: 'English',    sub: 'English',             isoCode: 'GB' },
];

export default function LanguageSelectScreen({ navigation }) {
  const [selected, setSelected] = useState('zh-CN');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#EEEEEE', '#6FCF97', '#2FA084', '#1F6F5F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bgTop}
      />

      <Image source={require('../../assets/hana_satto.png')} style={styles.character} />
      <AppText style={styles.headerTitle}>HANA EZPZ</AppText>
      <AppText style={styles.headerSubtitle}>Korea Travel Wallet</AppText>

      <View style={styles.card}>
        <AppText style={styles.title}>언어를 선택하세요</AppText>
        <AppText style={styles.subtitle}>Select your language to continue</AppText>

        <View style={styles.list}>
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                style={[styles.item, isSelected && styles.itemSelected]}
                onPress={() => setSelected(lang.id)}
                activeOpacity={0.7}
              >
                <CountryFlag isoCode={lang.isoCode} size={24} style={styles.flag} />
                <View style={styles.itemText}>
                  <AppText style={[styles.langLabel, isSelected && styles.langLabelSelected]}>
                    {lang.label}
                  </AppText>
                  <AppText style={styles.langSub}>{lang.sub}</AppText>
                </View>
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <AppText style={styles.checkMark}>✓</AppText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <AnimatedButton
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <AppText style={styles.loginText}>Select →</AppText>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  character: {
    position: 'absolute',
    top: 60,
    left: 148,
    width: 94,
    height: 124,
    resizeMode: 'contain',
  },
  headerTitle: {
    position: 'absolute',
    top: 200,
    left: 125,
    width: 133,
    height: 24,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
  },
  headerSubtitle: {
    position: 'absolute',
    top: 226,
    left: 129,
    width: 118,
    height: 16,
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.85,
    textAlign: 'center',
  },
  card: {
    position: 'absolute',
    top: 290,
    left: 20,
    width: 350,
    height: 496,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 20,
  },
  list: {
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  itemSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  flag: {
    fontSize: 26,
    marginRight: 12,
  },
  itemText: {
    flex: 1,
  },
  langLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  langLabelSelected: {
    color: COLORS.primary,
  },
  langSub: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  loginButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
