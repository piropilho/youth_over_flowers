import React, { useState } from 'react';
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
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
        <AppText style={styles.backBtnText}>‹</AppText>
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
          placeholderTextColor={COLORS  .textGray}
          secureTextEntry
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

        <TouchableOpacity style={styles.infoRow}>
          <AppText style={styles.infoText}>로그인 이용안내 </AppText>
          <AppText style={styles.infoIcon}>?</AppText>
        </TouchableOpacity>
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <AnimatedButton style={styles.loginButton} onPress={() => navigation.navigate('Verification')}>
          <AppText style={styles.loginText}>Login</AppText>
        </AnimatedButton>
        <TouchableOpacity>
          <AppText style={styles.altLogin}>다른 방법으로 로그인</AppText>
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
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textGray,
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
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  altLogin: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textGray,
  },
});
