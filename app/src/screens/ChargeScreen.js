import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { COLORS } from '../constants/colors';
import AnimatedButton from '../components/AnimatedButton';
import pendingCharge from '../utils/pendingCharge';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CURRENCIES = [
  { code: 'CNY', name: '중국 위안(CNY)',  isoCode: 'cn', rateLabel: '1위안 = 226.04원',  ratePerOne: 226.04, symbol: 'CN¥', quickAmounts: [500, 1000, 2000, 5000] },
  { code: 'JPY', name: '일본 엔(JPY)',    isoCode: 'jp', rateLabel: '100엔 = 956.2원',   ratePerOne: 9.562,  symbol: '¥',   quickAmounts: [5000, 10000, 30000, 50000] },
  { code: 'USD', name: '미국 달러(USD)',  isoCode: 'us', rateLabel: '1달러 = 1,480원',   ratePerOne: 1480,   symbol: '$',   quickAmounts: [50, 100, 200, 500] },
  { code: 'EUR', name: '유럽 유로(EUR)',  isoCode: 'eu', rateLabel: '1유로 = 1,523원',   ratePerOne: 1523,   symbol: '€',   quickAmounts: [50, 100, 200, 500] },
  { code: 'THB', name: '태국 바트(THB)',  isoCode: 'th', rateLabel: '1바트 = 39.52원',   ratePerOne: 39.52,  symbol: '฿',   quickAmounts: [1000, 3000, 5000, 10000] },
  { code: 'VND', name: '베트남 동(VND)', isoCode: 'vn', rateLabel: '1000동 = 54.1원',   ratePerOne: 0.0541, symbol: '₫',   quickAmounts: [500000, 1000000, 2000000, 5000000] },
];

function formatAmount(val, currency) {
  return val.toLocaleString('ko-KR') + currency.symbol;
}

function formatKRW(val) {
  return Math.round(val).toLocaleString('ko-KR');
}

function chipLabel(val, currency) {
  return `+${currency.symbol}${val.toLocaleString('ko-KR')}`;
}

export default function ChargeScreen({ navigation }) {
  const [inputValue, setInputValue] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[2]); // USD 기본
  const [sheetVisible, setSheetVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isFocused) {
      const blink = Animated.loop(
        Animated.sequence([
          Animated.timing(cursorOpacity, { toValue: 0, duration: 530, useNativeDriver: true }),
          Animated.timing(cursorOpacity, { toValue: 1, duration: 530, useNativeDriver: true }),
        ])
      );
      blink.start();
      return () => blink.stop();
    } else {
      cursorOpacity.setValue(1);
    }
  }, [isFocused]);

  const amount = parseInt(inputValue.replace(/,/g, ''), 10) || 0;

  const handleAmountChange = (text) => {
    const digits = text.replace(/[^0-9]/g, '');
    if (!digits) { setInputValue(''); return; }
    setInputValue(parseInt(digits, 10).toLocaleString('ko-KR'));
  };

  const overlayOpacity  = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const openSheet = () => {
    setSheetVisible(true);
    Animated.parallel([
      Animated.timing(overlayOpacity,   { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(sheetTranslateY,  { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start();
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity,   { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(sheetTranslateY,  { toValue: SCREEN_HEIGHT, duration: 200, useNativeDriver: true }),
    ]).start(() => setSheetVisible(false));
  };

  const selectCurrency = (c) => {
    setCurrency(c);
    setInputValue('');
    closeSheet();
  };

  const krwReceived = Math.round(amount * currency.ratePerOne);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>금액 충전</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <View style={styles.body}>
          <Text style={styles.title}>보유 통화를 선택해주세요</Text>

          <TouchableOpacity style={styles.currencyCard} activeOpacity={0.7} onPress={openSheet}>
            <CountryFlag isoCode={currency.isoCode} size={22} />
            <Text style={[styles.currencyName, { flex: 1 }]}>{currency.name}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.rateBanner}>
            <Text style={styles.rateLabel}>오늘의 환율</Text>
            <Text style={styles.rateValue}>  {currency.rateLabel}</Text>
            <Text style={styles.rateBadge}>우대 100%</Text>
          </View>

          <Text style={styles.amountLabel}>충전할 금액</Text>

          <View style={styles.amountRow}>
            <TouchableOpacity onPress={() => inputRef.current?.focus()} activeOpacity={0.8} style={[styles.amountTouchable, isFocused && styles.amountTouchableFocused]}>
              <View style={styles.amountInner}>
                {amount > 0 ? (
                  <>
                    <Text style={styles.amountText}>{currency.symbol}</Text>
                    <Text style={styles.amountText}>{amount.toLocaleString('ko-KR')}</Text>
                    {isFocused && <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />}
                  </>
                ) : (
                  <>
                    <Text style={[styles.amountText, styles.amountZero]}>{currency.symbol + '0'}</Text>
                    {isFocused && <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />}
                  </>
                )}
              </View>
            </TouchableOpacity>
            {amount > 0 && (
              <TouchableOpacity onPress={() => setInputValue('')} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>↺</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={inputValue}
            onChangeText={handleAmountChange}
            keyboardType="number-pad"
            returnKeyType="done"
            blurOnSubmit
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          <Text style={styles.convertedText}>
            {amount > 0 ? `≈ ₩${formatKRW(krwReceived)} 수령` : `₩0 수령`}
          </Text>

          <View style={styles.chipRow}>
            {currency.quickAmounts.map((val) => (
              <TouchableOpacity key={val} style={styles.chip} onPress={() => { const next = amount + val; setInputValue(next.toLocaleString('ko-KR')); }}>
                <Text style={styles.chipText}>{chipLabel(val, currency)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {amount > 0 && (
            <Text style={styles.estimatedText}>충전 후 예상 수령액 ≈ ₩ {formatKRW(krwReceived)}</Text>
          )}
        </View>

        <View style={styles.bottom}>
          {amount > 0 ? (
            <AnimatedButton
              style={styles.chargeBtn}
              onPress={() => {
                pendingCharge.krw = krwReceived;
                navigation.navigate('ChargeSuccess', {
                  krw: krwReceived,
                  foreignAmount: amount,
                  currencySymbol: currency.symbol,
                  currencyCode: currency.code,
                });
              }}
            >
              <Text style={styles.chargeBtnText}>원화로 충전하기</Text>
            </AnimatedButton>
          ) : (
            <View style={[styles.chargeBtn, styles.chargeBtnDisabled]}>
              <Text style={styles.chargeBtnText}>원화로 충전하기</Text>
            </View>
          )}
          <TouchableOpacity>
            <Text style={styles.helpText}>도움이 필요하신가요? 지원센터 문의</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 통화 선택 바텀시트 */}
      <Modal visible={sheetVisible} transparent animationType="none">
        <View style={{ flex: 1 }}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: overlayOpacity }]} />
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeSheet} />
          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>환전 통화 선택</Text>
              <TouchableOpacity onPress={closeSheet} style={styles.closeBtn}>
                <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>
            </View>
            {CURRENCIES.map((c) => {
              const isSelected = c.code === currency.code;
              return (
                <TouchableOpacity
                  key={c.code}
                  style={[styles.currencyRow, isSelected && styles.currencyRowSelected]}
                  onPress={() => selectCurrency(c)}
                  activeOpacity={0.7}
                >
                  <CountryFlag isoCode={c.isoCode} size={22} />
                  <Text style={styles.currencyRowName}>{c.name}</Text>
                  <Text style={[styles.currencyRowRate, isSelected && styles.currencyRowRateSelected]}>
                    {c.rateLabel}{isSelected ? ' ✓' : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:              { flex: 1, backgroundColor: COLORS.white },
  header:                 { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backBtn:                { paddingHorizontal: 16, paddingVertical: 6 },
  backBtnText:            { fontSize: 20, color: COLORS.textDark },
  headerTitle:            { position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: 'Hana2-Bold', fontSize: 17, color: COLORS.textDark, zIndex: -1 },
  body:                   { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  title:                  { fontFamily: 'Hana2-Bold', fontSize: 22, color: COLORS.textDark, marginBottom: 20 },
  currencyCard:           {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 12, gap: 12,
    borderWidth: 1, borderColor: '#008465',
    shadowOpacity: 0, elevation: 0, backgroundColor: '#E6F4F0',
  },
  currencyInfo:           { flex: 1 },
  currencyName:           { fontFamily: 'Hana2-Bold', fontSize: 15, color: COLORS.textDark },
  currencyHint:           { fontFamily: 'Hana2-Regular', fontSize: 12, color: '#4B5563', marginTop: 2 },
  chevron:                { fontSize: 26, color: '#008465', fontWeight: '600' },
  rateBanner:             { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FAF6', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, marginBottom: 44, gap: 4 },
  rateLabel:              { fontFamily: 'Hana2-Regular', fontSize: 12, color: '#9CA3AF' },
  rateValue:              { fontFamily: 'Hana2-Medium', fontSize: 12, color: COLORS.primary, flex: 1 },
  rateBadge:              { fontFamily: 'Hana2-Bold', fontSize: 11, color: COLORS.primary, backgroundColor: '#D1FAE5', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  amountLabel:            { fontFamily: 'Hana2-Medium', fontSize: 13, color: '#9CA3AF', marginBottom: 10 },
  amountRow:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 6 },
  amountTouchable:        { flex: 1, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: '#E5E7EB' },
  amountTouchableFocused: { borderBottomColor: COLORS.primary },
  amountInner:            { flexDirection: 'row', alignItems: 'center' },
  amountText:             { fontFamily: 'Hana2-Bold', fontSize: 40, color: COLORS.textDark },
  amountZero:             { color: '#D1D5DB' },
  cursor:                 { width: 2.5, height: 40, backgroundColor: COLORS.primary, marginHorizontal: 2, borderRadius: 2 },
  clearBtn:               { marginLeft: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  clearBtnText:           { fontSize: 18, color: '#9CA3AF', lineHeight: 22 },
  convertedText:          { fontFamily: 'Hana2-Regular', fontSize: 14, color: '#6B7280', marginBottom: 16, marginTop: 2 },
  chipRow:                { flexDirection: 'row', gap: 8, justifyContent: 'flex-start', flexWrap: 'wrap' },
  estimatedText:          { fontFamily: 'Hana2-Regular', fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 32 },
  chip:                   { backgroundColor: '#F2F9F6', borderRadius: 50, paddingHorizontal: 16, paddingVertical: 8 },
  chipText:               { fontFamily: 'Hana2-Medium', fontSize: 13, color: '#008465' },
  bottom:                 { paddingHorizontal: 24, paddingBottom: 32, gap: 12 },
  chargeBtn:              { backgroundColor: '#05A68B', borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  chargeBtnDisabled:      { opacity: 0.4 },
  chargeBtnText:          { fontFamily: 'Hana2-Bold', fontSize: 16, color: COLORS.white },
  helpText:               { fontFamily: 'Hana2-Regular', fontSize: 13, color: COLORS.textGray, textAlign: 'center' },
  hiddenInput:            { position: 'absolute', width: 1, height: 1, opacity: 0 },
  overlay:                { backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet:                  { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 36 },
  sheetHeader:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20 },
  sheetTitle:             { fontFamily: 'Hana2-Bold', fontSize: 18, color: COLORS.textDark },
  closeBtn:               { padding: 6 },
  closeText:              { fontSize: 16, color: COLORS.textGray },
  currencyRow:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, gap: 12 },
  currencyRowSelected:    { backgroundColor: COLORS.primaryLight, marginHorizontal: 12, borderRadius: 12 },
  currencyRowName:        { fontFamily: 'Hana2-Regular', fontSize: 15, color: COLORS.textDark, flex: 1 },
  currencyRowRate:        { fontFamily: 'Hana2-Regular', fontSize: 13, color: COLORS.textGray },
  currencyRowRateSelected:{ color: COLORS.primary, fontFamily: 'Hana2-Bold' },
});