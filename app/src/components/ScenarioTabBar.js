import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TABS = [
  { key: 'before', label: '여행 전 ✈️' },
  { key: 'during', label: '여행 중 🇰🇷' },
];

export default function ScenarioTabBar({ currentStage, onPress }) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = currentStage === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onPress?.(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontFamily: 'Hana2-Medium',
    fontSize: 14,
    color: '#9CA3AF',
  },
  labelActive: {
    fontFamily: 'Hana2-Bold',
    color: '#008465',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#008465',
  },
});
