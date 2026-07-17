import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AppText from '../components/AppText';
import AnimatedButton from '../components/AnimatedButton';
import { COLORS } from '../constants/colors';

export default function LoginScreen({ navigation }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>‹</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Image
          source={require('../../assets/hana-symbol.png')}
          style={styles.headerLogo}
        />
        <AppText style={styles.headerTitle}>HANA <AppText style={{ color: '#E90061' }}>EZPZ</AppText></AppText>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <AppText style={styles.title}>로그인</AppText>
        <AppText style={styles.subtitle}>Please enter your login information</AppText>

        <TextInput
          style={styles.input}
          placeholder="ID"
          placeholderTextColor={COLORS.textGray}
          value={id}
          onChangeText={setId}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor={COLORS.textGray}
          secureTextEntry
          textContentType="oneTimeCode"
          value={password}
          onChangeText={setPassword}
          returnKeyType="go"
          onSubmitEditing={() => navigation.navigate('Verification')}
        />

        <View style={styles.linkRow}>
          <TouchableOpacity>
            <AppText style={styles.link}>아이디 찾기</AppText>
          </TouchableOpacity>
          <AppText style={styles.divider}>|</AppText>
          <TouchableOpacity>
            <AppText style={styles.link}>비밀번호 재설정</AppText>
          </TouchableOpacity>
        </View>

        {/* 소셜 로그인 */}
        <View style={styles.socialDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </Svg>
            <Text style={styles.socialBtnText}>Google로 계속하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="#111827">
              <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </Svg>
            <Text style={styles.socialBtnText}>Apple로 계속하기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <AnimatedButton style={styles.loginButton} onPress={() => navigation.navigate('Verification')}>
          <AppText style={styles.loginText}>Login</AppText>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingTop: 14,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    fontSize: 32,
    color: COLORS.textDark,
    lineHeight: 34,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  headerLogo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Hana2-Bold',
    fontSize: 30,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 12,
    fontFamily: 'Hana2-Regular',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  divider: {
    color: COLORS.border,
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  infoIcon: {
    fontSize: 12,
    color: COLORS.textGray,
    borderWidth: 1,
    borderColor: COLORS.textGray,
    borderRadius: 10,
    width: 16,
    height: 16,
    textAlign: 'center',
    lineHeight: 14,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  socialDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 14,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerLabel: {
    fontFamily: 'Hana2-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  socialRow: {
    gap: 10,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 14,
  },
  socialBtnText: {
    fontFamily: 'Hana2-Medium',
    fontSize: 14,
    color: '#111827',
  },
  loginButton: {
    backgroundColor: '#05A68B',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
