import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
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
        {/* 배경 태극 문양 워터마크 */}
        <View style={styles.bgPattern} pointerEvents="none">
          <Svg width={320} height={320} viewBox="0 0 200 200">
            <Path d="M100 10 A90 90 0 1 1 99.999 10 Z" stroke="rgba(0,100,70,0.12)" strokeWidth={1.5} fill="none" />
            <Path d="M100 10 A45 45 0 0 1 100 100 A45 45 0 0 0 100 190 A90 90 0 0 1 100 10 Z" fill="rgba(0,100,70,0.07)" />
          </Svg>
        </View>

        {/* 중앙 캐릭터 */}
        <View style={styles.centerContent}>
          <Image source={require('../../assets/walking.png')} style={styles.character} resizeMode="contain" />
          <Image source={require('../../assets/main-title.png')} style={styles.mainTitle} resizeMode="contain" />
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
  bgPattern: {
    position: 'absolute',
    right: -40,
    top: 20,
    zIndex: 0,
  },
  centerContent: {
    alignItems: 'center',
  },
  character: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  mainTitle: {
    width: 300,
    height: 82,
    marginBottom: 8,
  },
  appSubtitle: {
    fontFamily: 'Hana2-Regular',
    fontSize: 17,
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
