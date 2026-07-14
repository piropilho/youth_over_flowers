import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import AnimatedButton from '../components/AnimatedButton';
import { COLORS } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';

const LANGUAGES = [
  { id: 'zh-CN', isoCode: 'CN', native: '中文 (简体)',        english: 'Chinese Simplified' },
  { id: 'zh-TW', isoCode: 'TW', native: '中文 (繁體)',        english: 'Chinese Traditional' },
  { id: 'ja',    isoCode: 'JP', native: '日本語',             english: 'Japanese' },
  { id: 'ko',    isoCode: 'KR', native: '한국어',             english: 'Korean' },
  { id: 'en',    isoCode: 'GB', native: 'English',            english: 'English' },
  { id: 'fr',    isoCode: 'FR', native: 'Français',           english: 'French' },
  { id: 'de',    isoCode: 'DE', native: 'Deutsch',            english: 'German' },
  { id: 'es',    isoCode: 'ES', native: 'Español',            english: 'Spanish' },
  { id: 'it',    isoCode: 'IT', native: 'Italiano',           english: 'Italian' },
  { id: 'pt',    isoCode: 'PT', native: 'Português',          english: 'Portuguese' },
  { id: 'ru',    isoCode: 'RU', native: 'Русский',            english: 'Russian' },
  { id: 'hi',    isoCode: 'IN', native: 'हिन्दी',             english: 'Hindi' },
  { id: 'bn',    isoCode: 'BD', native: 'বাংলা',              english: 'Bengali' },
  { id: 'th',    isoCode: 'TH', native: 'ภาษาไทย',           english: 'Thai' },
  { id: 'vi',    isoCode: 'VN', native: 'Tiếng Việt',        english: 'Vietnamese' },
  { id: 'id',    isoCode: 'ID', native: 'Bahasa Indonesia',  english: 'Indonesian' },
  { id: 'ms',    isoCode: 'MY', native: 'Bahasa Melayu',     english: 'Malay' },
  { id: 'tl',    isoCode: 'PH', native: 'Filipino',          english: 'Filipino' },
  { id: 'tr',    isoCode: 'TR', native: 'Türkçe',            english: 'Turkish' },
  { id: 'nl',    isoCode: 'NL', native: 'Nederlands',        english: 'Dutch' },
  { id: 'pl',    isoCode: 'PL', native: 'Polski',            english: 'Polish' },
  { id: 'sv',    isoCode: 'SE', native: 'Svenska',           english: 'Swedish' },
  { id: 'uk',    isoCode: 'UA', native: 'Українська',        english: 'Ukrainian' },
  { id: 'sw',    isoCode: 'KE', native: 'Kiswahili',         english: 'Swahili' },
];

const T = {
  'zh-CN': { title: '选择语言',      subtitle: '请选择您偏好的语言以继续',              continueBtn: '继续' },
  'zh-TW': { title: '選擇語言',      subtitle: '請選擇您偏好的語言以繼續',              continueBtn: '繼續' },
  ja:      { title: '言語を選択',    subtitle: '続けるには言語を選んでください',          continueBtn: '続ける' },
  ko:      { title: '언어 선택',     subtitle: '계속하려면 언어를 선택하세요',           continueBtn: '계속' },
  en:      { title: 'Select Language',   subtitle: 'Choose your preferred language to continue',       continueBtn: 'Continue' },
  fr:      { title: 'Choisir la langue', subtitle: 'Choisissez votre langue préférée pour continuer', continueBtn: 'Continuer' },
  de:      { title: 'Sprache wählen',    subtitle: 'Wählen Sie Ihre bevorzugte Sprache aus',          continueBtn: 'Weiter' },
  es:      { title: 'Seleccionar idioma',subtitle: 'Elige tu idioma preferido para continuar',        continueBtn: 'Continuar' },
  it:      { title: 'Seleziona lingua',  subtitle: 'Scegli la tua lingua preferita per continuare',   continueBtn: 'Continua' },
  pt:      { title: 'Selecionar idioma', subtitle: 'Escolha seu idioma preferido para continuar',     continueBtn: 'Continuar' },
  ru:      { title: 'Выбор языка',       subtitle: 'Выберите предпочитаемый язык для продолжения',   continueBtn: 'Продолжить' },
  hi:      { title: 'भाषा चुनें',        subtitle: 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें',      continueBtn: 'जारी रखें' },
  bn:      { title: 'ভাষা বেছে নিন',    subtitle: 'চালিয়ে যেতে আপনার পছন্দের ভাষা বেছে নিন',       continueBtn: 'চালিয়ে যান' },
  th:      { title: 'เลือกภาษา',         subtitle: 'เลือกภาษาที่คุณต้องการเพื่อดำเนินการต่อ',        continueBtn: 'ดำเนินการต่อ' },
  vi:      { title: 'Chọn ngôn ngữ',    subtitle: 'Chọn ngôn ngữ ưa thích để tiếp tục',             continueBtn: 'Tiếp tục' },
  id:      { title: 'Pilih Bahasa',      subtitle: 'Pilih bahasa yang Anda inginkan untuk melanjutkan', continueBtn: 'Lanjutkan' },
  ms:      { title: 'Pilih Bahasa',      subtitle: 'Pilih bahasa pilihan anda untuk meneruskan',      continueBtn: 'Teruskan' },
  tl:      { title: 'Pumili ng Wika',    subtitle: 'Piliin ang iyong gustong wika upang magpatuloy',  continueBtn: 'Magpatuloy' },
  tr:      { title: 'Dil Seçin',         subtitle: 'Devam etmek için tercih ettiğiniz dili seçin',   continueBtn: 'Devam Et' },
  nl:      { title: 'Taal kiezen',       subtitle: 'Kies uw voorkeurstaal om door te gaan',           continueBtn: 'Doorgaan' },
  pl:      { title: 'Wybierz język',     subtitle: 'Wybierz preferowany język, aby kontynuować',      continueBtn: 'Kontynuuj' },
  sv:      { title: 'Välj språk',        subtitle: 'Välj ditt önskade språk för att fortsätta',       continueBtn: 'Fortsätt' },
  uk:      { title: 'Вибір мови',        subtitle: 'Виберіть бажану мову для продовження',            continueBtn: 'Продовжити' },
  sw:      { title: 'Chagua Lugha',      subtitle: 'Chagua lugha unayopendelea ili uendelee',         continueBtn: 'Endelea' },
};

export default function LanguageSelectScreen({ navigation }) {
  const [selected, setSelected] = useState('zh-CN');
  const t = T[selected];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconWrap}>
        <LinearGradient
          colors={['#2DAE8A', '#0D7A5A', '#064D38']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircle}
        >
          <Svg width={38} height={38} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke="white" strokeWidth={1.5} />
            <Path d="M12 2c-2.5 3-4 6.5-4 10s1.5 7 4 10" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
            <Path d="M12 2c2.5 3 4 6.5 4 10s-1.5 7-4 10" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
            <Path d="M2 12h20" stroke="white" strokeWidth={1.5} strokeLinecap="round" />
            <Path d="M3.5 7.5h17M3.5 16.5h17" stroke="white" strokeWidth={1.3} strokeLinecap="round" />
          </Svg>
        </LinearGradient>
      </View>

      <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
        {t.title}
      </Text>
      <Text style={styles.subtitle} numberOfLines={2}>
        {t.subtitle}
      </Text>

      <FlatList
        data={LANGUAGES}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: lang }) => {
          const isSelected = selected === lang.id;
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => setSelected(lang.id)}
              activeOpacity={0.6}
            >
              <CountryFlag isoCode={lang.isoCode} size={22} style={styles.flag} />
              <View style={styles.itemText}>
                <Text style={[styles.langLabel, isSelected && styles.langLabelSelected]} numberOfLines={1}>
                  {lang.native}
                </Text>
                <Text style={styles.langSub} numberOfLines={1}>{lang.english}</Text>
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <View style={styles.bottomArea}>
        <AnimatedButton
          style={styles.continueButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.continueText}>
            {t.continueBtn}
          </Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconWrap: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 16,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 26,
    color: COLORS.textDark,
    textAlign: 'center',
    height: 36,
    marginBottom: 6,
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 13,
    color: COLORS.textGray,
    textAlign: 'center',
    height: 38,
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    height: 60,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginLeft: 40,
  },
  flag: {
    marginRight: 14,
  },
  itemText: {
    flex: 1,
  },
  langLabel: {
    fontWeight: '700',
    fontSize: 15,
    color: COLORS.textDark,
  },
  langLabelSelected: {
    color: COLORS.primary,
  },
  langSub: {
    fontWeight: '400',
    fontSize: 11,
    color: COLORS.textGray,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioSelected: {
    borderColor: '#00B488',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00B488',
  },
  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
  continueButton: {
    backgroundColor: '#05A68B',
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
  },
});
