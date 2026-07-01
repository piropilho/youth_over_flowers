import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const LEFT_TABS  = [
  { key: 'home',   label: 'Home'   },
  { key: 'coupon', label: 'Coupon' },
];
const RIGHT_TABS = [
  { key: 'map', label: 'Map' },
  { key: 'my',  label: 'My'  },
];

function TabIcon({ name, active, dark }) {
  const color = active ? COLORS.primary : (dark ? 'rgba(255,255,255,0.5)' : '#BDBDBD');
  if (name === 'home') return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11.5L12 3l9 8.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z" stroke={color} strokeWidth={1.8} fill={active ? color : 'none'} />
      <Path d="M9 22V12h6v10" stroke={active ? COLORS.white : color} strokeWidth={1.8} />
    </Svg>
  );
  if (name === 'coupon') return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M2 8.5V6a1 1 0 011-1h18a1 1 0 011 1v2.5a2 2 0 000 4V16a1 1 0 01-1 1H3a1 1 0 01-1-1v-3a2 2 0 000-4z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Line x1="9" y1="5" x2="9" y2="17" stroke={color} strokeWidth={1.5} strokeDasharray="2 2" />
    </Svg>
  );
  if (name === 'map') return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M9 3L2 6.5v14L9 17l6 3.5 7-3.5v-14L15 6.5 9 3z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Line x1="9" y1="3" x2="9" y2="17" stroke={color} strokeWidth={1.5} />
      <Line x1="15" y1="6.5" x2="15" y2="20.5" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
  if (name === 'my') return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 21C12 21 4 15.5 4 9.5a4.5 4.5 0 019-0c.1-.1.2-.2.3-.3A4.5 4.5 0 0121 9.5C21 15.5 12 21 12 21z" stroke={color} strokeWidth={1.8} fill={active ? color : 'none'} />
    </Svg>
  );
  return null;
}

export default function BottomTabBar({ activeTab = 'home', navigation, balance = 0, dark = false }) {
  const handleTab = (key) => {
    if (key === 'home') navigation.navigate('Home');
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.bar, dark && styles.barDark]}>
        {LEFT_TABS.map(tab => {
          const active = tab.key === activeTab;
          return (
            <TouchableOpacity key={tab.key} style={styles.item} onPress={() => handleTab(tab.key)} activeOpacity={0.7}>
              <TabIcon name={tab.key} active={active} dark={dark} />
              <Text style={[styles.label, active && styles.labelActive, dark && !active && styles.labelDark]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.centerSpace} />
        {RIGHT_TABS.map(tab => {
          const active = tab.key === activeTab;
          return (
            <TouchableOpacity key={tab.key} style={styles.item} onPress={() => handleTab(tab.key)} activeOpacity={0.7}>
              <TabIcon name={tab.key} active={active} dark={dark} />
              <Text style={[styles.label, active && styles.labelActive, dark && !active && styles.labelDark]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity
        style={styles.centerBtn}
        activeOpacity={0.85}
        onPress={() => activeTab === 'qr' ? navigation.navigate('Home') : navigation.navigate('QRPay', { balance })}
      >
        {activeTab === 'qr' ? (
          <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <Path d="M3 11.5L12 3l9 8.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z" stroke={COLORS.primary} strokeWidth={2} fill="none" />
            <Path d="M9 22V12h6v10" stroke={COLORS.primary} strokeWidth={2} />
          </Svg>
        ) : (
          <Image source={require('../../assets/qrcode.png')} style={styles.centerIcon} resizeMode="contain" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:     { alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: 10,
    paddingTop: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 10,
  },
  item:        { flex: 1, alignItems: 'center', gap: 4 },
  centerSpace: { width: 72 },
  centerBtn: {
    position: 'absolute',
    top: -30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#BDE4DC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  centerIcon:  { width: 32, height: 32 },
  label:       { fontFamily: 'Hana2-Regular', fontSize: 11, color: '#BDBDBD' },
  labelActive: { color: COLORS.primary, fontFamily: 'Hana2-Medium' },
  labelDark:   { color: 'rgba(255,255,255,0.5)' },
  barDark: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
});