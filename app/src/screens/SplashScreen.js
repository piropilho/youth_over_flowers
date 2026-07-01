import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

export default function SplashScreen({ navigation }) {
  return (
    <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => navigation.replace('LanguageSelect')}>
      <LinearGradient
        colors={['#C8EEE0', '#DDF5EC', '#EFF9F4', '#F5FBF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* 중앙 캐릭터 */}
        <View style={styles.centerContent}>
          <Image source={require('../../assets/walking.png')} style={styles.character} resizeMode="contain" />
          <Text style={styles.appTitle}>HANA EZPZ</Text>
          <Text style={styles.appSubtitle}>Korea Travel Wallet</Text>
          <Text style={styles.tapHint}>tap anywhere to start</Text>
        </View>

      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeft: {
    position: 'absolute',
    top: 60,
    left: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallLogo: {
    width: 28,
    height: 28,
  },
  brandName: {
    fontFamily: 'Hana2-Bold',
    fontSize: 15,
    color: COLORS.primaryDark,
  },
  bigText: {
    position: 'absolute',
    fontFamily: 'Hana2-Bold',
    fontSize: 96,
    color: COLORS.primary,
    opacity: 0.13,
    letterSpacing: -2,
  },
  bigTextLeft: {
    left: -8,
    top: '22%',
  },
  bigTextRight: {
    right: -8,
    bottom: '17%',
  },
  centerContent: {
    alignItems: 'center',
  },
  character: {
    width: 160,
    height: 160,
    marginBottom: 16,
  },
  appTitle: {
    fontFamily: 'Hana2-Bold',
    fontSize: 28,
    color: '#004D40',
    letterSpacing: 1,
  },
  appSubtitle: {
    fontFamily: 'Hana2-Regular',
    fontSize: 14,
    color: '#004D40',
    letterSpacing: 0.5,
    marginTop: 4,
    opacity: 0.85,
  },
  tapHint: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: COLORS.primary,
    opacity: 0.6,
    marginTop: 8,
    letterSpacing: 0.3,
  },
});
