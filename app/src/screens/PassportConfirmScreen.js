import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';

const SEX_OPTIONS = ['Male', 'Female', 'Unknown'];

export default function PassportConfirmScreen({ navigation, route }) {
  const data = route.params?.passportData ?? {};
  const initialFullName = [data.surname, data.given_names].filter(Boolean).join(' ');

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: initialFullName,
    passport_number: data.passport_number || '',
    nationality: data.nationality || '',
    date_of_birth: data.date_of_birth || '',
    sex: data.sex || 'Unknown',
  });
  const [savedData, setSavedData] = useState({ ...editData });

  const handleEdit = () => setIsEditing(true);

  const handleDone = () => {
    setSavedData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...savedData });
    setIsEditing(false);
  };

  const cycleSex = () => {
    const idx = SEX_OPTIONS.indexOf(editData.sex);
    setEditData(prev => ({ ...prev, sex: SEX_OPTIONS[(idx + 1) % SEX_OPTIONS.length] }));
  };

  const FIELDS = [
    { label: '성명', key: 'fullName', autoCapitalize: 'characters' },
    { label: '여권번호', key: 'passport_number', autoCapitalize: 'characters' },
    { label: '국적', key: 'nationality', autoCapitalize: 'characters' },
    { label: '생년월일', key: 'date_of_birth', autoCapitalize: 'none', keyboardType: 'default' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>본인 인증 1/2</Text>
        {isEditing ? (
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleCancel} style={styles.headerBtn}>
              <Text style={styles.cancelBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDone} style={styles.headerBtn}>
              <Text style={styles.doneBtnText}>완료</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleEdit} style={styles.headerBtn}>
            <Text style={styles.editBtnText}>수정</Text>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>여권 정보를 확인해 주세요</Text>
          <Text style={styles.subtitle}>Confirm your passport information</Text>

          <View style={[styles.card, isEditing && styles.cardEditing]}>
            {FIELDS.map(({ label, key, autoCapitalize, keyboardType }, i) => (
              <View key={key} style={[styles.row, styles.rowBorder]}>
                <Text style={styles.rowLabel}>{label}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.rowInput}
                    value={editData[key]}
                    onChangeText={v => setEditData(prev => ({ ...prev, [key]: v }))}
                    autoCapitalize={autoCapitalize || 'characters'}
                    keyboardType={keyboardType || 'default'}
                    returnKeyType="done"
                    placeholderTextColor="#BBBBBB"
                  />
                ) : (
                  <Text style={styles.rowValue}>{savedData[key] || '-'}</Text>
                )}
              </View>
            ))}

            {/* 성별 — 탭으로 토글 */}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>성별</Text>
              {isEditing ? (
                <TouchableOpacity onPress={cycleSex} style={styles.sexToggle}>
                  <Text style={styles.sexToggleText}>{editData.sex}</Text>
                  <Text style={styles.sexCaret}>  ▾</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.rowValue}>{savedData.sex || '-'}</Text>
              )}
            </View>
          </View>

          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              {isEditing
                ? '여권에 표시된 정보와 동일하게 입력해 주세요.'
                : '정보가 다르다면 수정 버튼을 누르거나 다시 스캔해 주세요.'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottom}>
        <AnimatedButton style={styles.button} onPress={() => navigation.navigate('FaceScan')}>
          <Text style={styles.buttonText}>정보 확인 완료</Text>
        </AnimatedButton>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.rescanText}>다시 스캔하기</Text>
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
  headerActions: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 4,
  },
  headerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 'auto',
  },
  editBtnText: {
    fontFamily: 'Hana2-Medium',
    fontSize: 15,
    color: COLORS.primary,
  },
  doneBtnText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 15,
    color: COLORS.primary,
  },
  cancelBtnText: {
    fontFamily: 'Hana2-Regular',
    fontSize: 15,
    color: COLORS.textGray,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Hana2-Bold',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Hana2-Regular',
    color: COLORS.textGray,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cardEditing: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  rowLabel: {
    fontFamily: 'Hana2-Regular',
    fontSize: 14,
    color: COLORS.textGray,
    width: 72,
  },
  rowValue: {
    fontFamily: 'Hana2-Bold',
    fontSize: 15,
    color: COLORS.textDark,
    flex: 1,
    textAlign: 'right',
  },
  rowInput: {
    fontFamily: 'Hana2-Bold',
    fontSize: 15,
    color: COLORS.textDark,
    flex: 1,
    textAlign: 'right',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  sexToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sexToggleText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 15,
    color: COLORS.primary,
  },
  sexCaret: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: COLORS.primary,
  },
  noticeBox: {
    backgroundColor: '#FFF8E6',
    borderRadius: 12,
    padding: 14,
  },
  noticeText: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: '#8A6C00',
    lineHeight: 20,
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
  rescanText: {
    fontFamily: 'Hana2-Regular',
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: 'center',
  },
});
