import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import LoginScreen from '../screens/LoginScreen';
import VerificationScreen from '../screens/VerificationScreen';
import PassportScanScreen from '../screens/PassportScanScreen';
import FaceScanScreen from '../screens/FaceScanScreen';
import FaceScanCameraScreen from '../screens/FaceScanCameraScreen';
import VerificationCompleteScreen from '../screens/VerificationCompleteScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="LanguageSelect" component={LanguageSelectScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="PassportScan" component={PassportScanScreen} />
        <Stack.Screen name="FaceScan" component={FaceScanScreen} />
        <Stack.Screen name="FaceScanCamera" component={FaceScanCameraScreen} />
        <Stack.Screen name="VerificationComplete" component={VerificationCompleteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
