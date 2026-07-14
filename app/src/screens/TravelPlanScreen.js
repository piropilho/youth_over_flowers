import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function buildCalendarRows(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}


export default function TravelPlanScreen({ navigation, route }) {
  const today = new Date();
  const [departDate, setDepartDate] = useState(route.params?.initialDepartDate ?? '');
  const [returnDate, setReturnDate] = useState(route.params?.initialReturnDate ?? '');

  const [calVisible, setCalVisible] = useState(false);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [departSel, setDepartSel] = useState(null); // { year, month, day }

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT / 2)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const rows = buildCalendarRows(calYear, calMonth);

  const openCalendar = () => {
    setSelectedDay(null);
    setDepartSel(null);
    setCalYear(today.getFullYear());
    setCalMonth(today.getMonth());
    slideAnim.setValue(0);
    setCalVisible(true);
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(sheetTranslateY, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  };

  const closeCalendar = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(sheetTranslateY, { toValue: SCREEN_HEIGHT / 2, duration: 220, useNativeDriver: true }),
    ]).start(() => setCalVisible(false));
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelectedDay(null);
  };

  const openReturnCalendar = () => {
    if (!departDate) { openCalendar(); return; }
    const [y, m, d] = departDate.replace(/\s/g, '').split('-').map(Number);
    setDepartSel({ year: y, month: m - 1, day: d });
    if (returnDate) {
      const [ry, rm, rd] = returnDate.replace(/\s/g, '').split('-').map(Number);
      setCalYear(ry); setCalMonth(rm - 1); setSelectedDay(rd);
    } else {
      setCalYear(today.getFullYear()); setCalMonth(today.getMonth()); setSelectedDay(null);
    }
    slideAnim.setValue(1);
    setCalVisible(true);
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(sheetTranslateY, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start();
  };

  const switchToReturn = () => {
    if (!selectedDay) return;
    const y = calYear;
    const m = String(calMonth + 1).padStart(2, '0');
    const d = String(selectedDay).padStart(2, '0');
    setDepartDate(`${y} - ${m} - ${d}`);
    setDepartSel({ year: calYear, month: calMonth, day: selectedDay });
    setSelectedDay(null);
    Animated.timing(slideAnim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  };

  const handleReturnSelect = () => {
    if (!selectedDay) return;
    const y = calYear;
    const m = String(calMonth + 1).padStart(2, '0');
    const d = String(selectedDay).padStart(2, '0');
    setReturnDate(`${y} - ${m} - ${d}`);
    closeCalendar();
  };

  const renderCalendarGrid = (isReturnPanel = false) => {
    // 날짜를 숫자 키로 변환 (YYYYMMDD, month는 0-index)
    const departKey = departSel
      ? departSel.year * 10000 + departSel.month * 100 + departSel.day
      : null;
    const returnKey = isReturnPanel && selectedDay !== null
      ? calYear * 10000 + calMonth * 100 + selectedDay
      : null;

    return (
      <>
        <View style={styles.monthRow}>
          <Text style={styles.monthText}>
            {calYear}년 {String(calMonth + 1).padStart(2, '0')}월
          </Text>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={styles.monthNavBtn}>
              <Text style={styles.monthNavText}>{'<'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={nextMonth} style={styles.monthNavBtn}>
              <Text style={styles.monthNavText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.weekRow}>
          {DAY_LABELS.map((d, i) => (
            <Text key={d} style={[styles.weekLabel, i === 0 && styles.sundayLabel]}>{d}</Text>
          ))}
        </View>

        {rows.map((row, ri) => (
          <View key={ri} style={styles.calRow}>
            {row.map((day, di) => {
              const isSelected = day !== null && day === selectedDay;
              const currentKey = day !== null ? calYear * 10000 + calMonth * 100 + day : null;
              const isRangeStart = isReturnPanel && day !== null && currentKey === departKey;
              const isRangeEnd = isReturnPanel && isSelected;
              const isInRange = isReturnPanel && day !== null
                && departKey !== null && returnKey !== null
                && currentKey > departKey && currentKey < returnKey;
              const showCircle = isSelected || isRangeStart;
              const isBeforeDepart = isReturnPanel && day !== null
                && departKey !== null && currentKey < departKey;
              const isDisabled = !day || (isReturnPanel && departKey !== null && currentKey <= departKey);

              return (
                <TouchableOpacity
                  key={di}
                  style={styles.cell}
                  onPress={() => day && setSelectedDay(day)}
                  disabled={isDisabled}
                >
                  {/* 범위 밴드: 귀국일이 선택된 경우에만 표시 */}
                  {returnKey !== null && (isInRange || isRangeStart || isRangeEnd) && (
                    <View style={[
                      styles.rangeBand,
                      isRangeStart && !isRangeEnd && styles.rangeBandRight,
                      isRangeEnd && !isRangeStart && styles.rangeBandLeft,
                    ]} />
                  )}
                  <View style={[styles.cellInner, showCircle && styles.cellSelected]}>
                    <Text style={[
                      styles.cellText,
                      di === 0 && styles.sundayText,
                      showCircle && styles.cellTextSelected,
                      isBeforeDepart && styles.cellTextDimmed,
                    ]}>
                      {day ?? ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>여행 계획 세우기</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>여행 날짜를 선택해주세요</Text>

          <Text style={styles.label}>가는 날</Text>
          <TouchableOpacity
            style={[styles.input, departDate && styles.inputDone]}
            onPress={openCalendar}
            activeOpacity={0.7}
          >
            <Text style={[styles.inputText, !departDate && styles.inputPlaceholder, { flex: 1 }]}>
              {departDate || 'YYYY - MM - DD'}
            </Text>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M6 9l6 6 6-6" stroke={departDate ? COLORS.primary : '#9CA3AF'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          <View style={styles.arrowRow}>
            <View style={styles.arrowCircle}>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path d="M6 9l6 6 6-6" stroke={COLORS.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
          </View>

          <Text style={styles.label}>오는 날</Text>
          <TouchableOpacity
            style={[styles.input, returnDate && styles.inputDone]}
            onPress={openReturnCalendar}
            activeOpacity={0.7}
          >
            <Text style={[styles.inputText, !returnDate && styles.inputPlaceholder, { flex: 1 }]}>
              {returnDate || 'YYYY - MM - DD'}
            </Text>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M6 9l6 6 6-6" stroke={returnDate ? COLORS.primary : '#9CA3AF'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        <View style={styles.bottom}>
          {!!(departDate && returnDate) && (
            <TouchableOpacity
              style={styles.confirmBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Home', { departDate, returnDate })}
            >
              <Text style={styles.confirmBtnText}>확인</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity>
            <Text style={styles.helpText}>도움이 필요하신가요? 지원센터 문의</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 달력 모달 */}
      <Modal visible={calVisible} transparent animationType="none">
        <View style={{ flex: 1 }}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.modalOverlay, { opacity: overlayOpacity }]} />
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeCalendar} />
          <Animated.View style={[styles.calSheet, { position: 'absolute', bottom: 0, left: 0, right: 0, height: SCREEN_HEIGHT / 2, transform: [{ translateY: sheetTranslateY }] }]}>
            <Animated.View style={{
              flexDirection: 'row',
              width: SCREEN_WIDTH * 2,
              flex: 1,
              transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -SCREEN_WIDTH] }) }],
            }}>
              {/* 가는 날 패널 */}
              <View style={[styles.calPanel, { width: SCREEN_WIDTH }]}>
                {renderCalendarGrid(false)}
                <TouchableOpacity
                  style={[styles.calButton, !selectedDay && styles.buttonDisabled]}
                  onPress={switchToReturn}
                  disabled={!selectedDay}
                >
                  <Text style={styles.buttonText}>오는 날 →</Text>
                </TouchableOpacity>
              </View>

              {/* 오는 날 패널 */}
              <View style={[styles.calPanel, { width: SCREEN_WIDTH }]}>
                {renderCalendarGrid(true)}
                <TouchableOpacity
                  style={[styles.calButton, !selectedDay && styles.buttonDisabled]}
                  onPress={handleReturnSelect}
                  disabled={!selectedDay}
                >
                  <Text style={styles.buttonText}>선택</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </Modal>
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
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  backBtnText: {
    fontSize: 20,
    color: COLORS.textDark,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'Hana2-Bold',
    fontSize: 17,
    color: COLORS.textDark,
    zIndex: -1,
  },
  body: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontFamily: 'Hana2-Bold',
    fontSize: 22,
    color: COLORS.textDark,
    marginBottom: 28,
  },
  label: {
    fontFamily: 'Hana2-Medium',
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputDone: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  inputText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 18,
    color: '#111827',
  },
  inputPlaceholder: {
    fontFamily: 'Hana2-Regular',
    fontSize: 15,
    color: COLORS.textGray,
  },
  arrowRow: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EBF5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  buttonText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 16,
    color: COLORS.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  confirmBtn: {
    backgroundColor: '#008485',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  confirmBtnText: {
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
  // 달력 모달
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  calSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  calPanel: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthText: {
    fontFamily: 'Hana2-Bold',
    fontSize: 15,
    color: COLORS.textDark,
  },
  monthNav: {
    flexDirection: 'row',
  },
  monthNavBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  monthNavText: {
    fontSize: 16,
    color: COLORS.textGray,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Hana2-Medium',
    fontSize: 12,
    color: COLORS.textGray,
    paddingVertical: 4,
  },
  sundayLabel: {
    color: '#E53935',
  },
  calRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 3,
  },
  rangeBand: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primaryLight,
  },
  rangeBandLeft: {
    right: '50%',
  },
  rangeBandRight: {
    left: '50%',
  },
  cellInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSelected: {
    backgroundColor: COLORS.primary,
  },
  cellText: {
    fontFamily: 'Hana2-Regular',
    fontSize: 13,
    color: COLORS.textDark,
  },
  cellTextSelected: {
    color: COLORS.white,
    fontFamily: 'Hana2-Bold',
  },
  cellTextDimmed: {
    color: COLORS.textGray,
    opacity: 0.35,
  },
  sundayText: {
    color: '#E53935',
  },
  calButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
});
