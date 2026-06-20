import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import {Image} from 'react-native'

// 메인 로고

function HanaLogo({ size = 120 }) {
  return (
    <Image
      source={require('../../assets/hana-symbol.png')}
      style={{ width: size, height: size, resizeMode: 'contain' }}
    />
  );
}

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LanguageSelect');
    }, 800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <HanaLogo size={120} />
      <AppText style={styles.title}>Hana Q-Local</AppText>
      <AppText style={styles.subtitle}>Korea Travel Wallet</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.primary,
    opacity: 0.75,
    letterSpacing: 0.3,
  },
});
