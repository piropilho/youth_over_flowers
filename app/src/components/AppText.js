import React from 'react';
import { Text, StyleSheet } from 'react-native';

const weightMap = {
  '300': 'Hana2-Light',
  '400': 'Hana2-Regular',
  '500': 'Hana2-Medium',
  '600': 'Hana2-CM',
  '700': 'Hana2-Bold',
  '800': 'Hana2-Heavy',
};

export default function AppText({ style, children, ...props }) {
  const flatStyle = StyleSheet.flatten(style) || {};
  const weight = String(flatStyle.fontWeight || '400');
  const fontFamily = weightMap[weight] || 'Hana2-Regular';

  return (
    <Text style={[{ fontFamily }, style]} {...props}>
      {children}
    </Text>
  );
}
