import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function DutchPaySetupScreen({ navigation }) {
  const [amount, setAmount] = useState('55500');
  const [people, setPeople] = useState(3);
  const [amountFocused, setAmountFocused] = useState(false);

  const parsed = parseInt(amount.replace(/,/g, ''), 10) || 0;
  const perPerson = people > 0 ? Math.floor(parsed / people) : 0;

  const handleAmountChange = (text) => {
    const digits = text.replace(/[^0-9]/g, '');
    setAmount(digits);
  };

  const formattedAmount = amount ? parseInt(amount, 10).toLocaleString('ko-KR') : '';

  const decrement = () => { if (people > 2) setPeople(p => p - 1); };
  const increment = () => { if (people < 20) setPeople(p => p + 1); };

  const handleGenerate = () => {
    navigation.navigate('DutchPay', { totalAmount: parsed, people, perPerson });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>더치페이 정산하기</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 금액 입력 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>정산할 총 금액을{'\n'}입력해주세요</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.amountInput}
                value={formattedAmount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                maxLength={13}
                placeholder="0"
                placeholderTextColor="#C4C4C4"
                selectionColor="#05A68B"
                caretHidden={!amountFocused}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
              />
              <Text style={styles.unitText}>원</Text>
            </View>
          </View>

          {/* 인원 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>몇 명이서 나눌까요?</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[styles.stepBtn, people <= 2 && styles.stepBtnDisabled]}
                onPress={decrement}
                activeOpacity={0.7}
              >
                <Text style={[styles.stepBtnText, people <= 2 && styles.stepBtnTextDisabled]}>−</Text>
              </TouchableOpacity>
              <View style={styles.stepValueWrap}>
                <Text style={styles.stepValue}>{people}</Text>
                <Text style={styles.stepUnit}>명</Text>
              </View>
              <TouchableOpacity
                style={[styles.stepBtn, people >= 20 && styles.stepBtnDisabled]}
                onPress={increment}
                activeOpacity={0.7}
              >
                <Text style={[styles.stepBtnText, people >= 20 && styles.stepBtnTextDisabled]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 인당 금액 프리뷰 */}
          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>인당 정산 금액</Text>
            <View style={styles.previewAmountRow}>
              <Text style={styles.previewAmountValue}>₩{perPerson.toLocaleString('ko-KR')}</Text>
              <Text style={styles.previewAmountSuffix}>씩 정산돼요</Text>
            </View>
          </View>
        </ScrollView>

        {/* 하단 버튼 */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.generateBtn, parsed === 0 && styles.generateBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleGenerate}
            disabled={parsed === 0}
          >
            <Text style={styles.generateBtnText}>QR 코드 생성하기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn:     { width: 40, paddingLeft: 4 },
  backBtnText: { fontSize: 20, color: COLORS.textDark },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Hana2-Bold',
    fontSize: 17,
    color: COLORS.textDark,
  },

  scroll: {
    paddingBottom: 32,
  },

  section: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 36,
  },
  sectionTitle: {
    fontFamily: 'Hana2-Bold',
    fontSize: 22,
    color: COLORS.textDark,
    lineHeight: 32,
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: 'Hana2-Medium',
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 24,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#05A68B',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  amountInput: {
    flex: 1,
    fontFamily: 'Hana2-Bold',
    fontSize: 26,
    color: COLORS.textDark,
    letterSpacing: -0.5,
    padding: 0,
  },
  unitText: {
    fontFamily: 'Hana2-Medium',
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 8,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EBF5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    backgroundColor: '#F3F4F6',
  },
  stepBtnText: {
    fontSize: 24,
    color: '#05A68B',
    lineHeight: 28,
    fontFamily: 'Hana2-Bold',
  },
  stepBtnTextDisabled: {
    color: '#C4C4C4',
  },
  stepValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 32,
    minWidth: 80,
    justifyContent: 'center',
  },
  stepValue: {
    fontFamily: 'Hana2-Bold',
    fontSize: 36,
    color: COLORS.textDark,
    letterSpacing: -1,
  },
  stepUnit: {
    fontFamily: 'Hana2-Medium',
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 6,
  },

  previewBox: {
    backgroundColor: '#EBF5F3',
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 12,
  },
  previewLabel: {
    fontFamily: 'Hana2-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  previewAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  previewAmountValue: {
    fontFamily: 'Hana2-Bold',
    fontSize: 28,
    color: '#008465',
    letterSpacing: -1,
  },
  previewAmountSuffix: {
    fontFamily: 'Hana2-Medium',
    fontSize: 17,
    color: '#374151',
  },

  bottom: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    backgroundColor: '#fff',
  },
  generateBtn: {
    backgroundColor: '#05A68B',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  generateBtnDisabled: {
    backgroundColor: '#C4C4C4',
  },
  generateBtnText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 16,
    color: '#fff',
  },
});
