import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function DynamicIsland() {
  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={styles.pill} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  pill: {
    width: 120,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#000',
  },
});
