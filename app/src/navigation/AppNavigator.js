import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LanguageSelectScreen from '../screens/LanguageSelectScreen';
import LoginScreen from '../screens/LoginScreen';
import VerificationScreen from '../screens/VerificationScreen';
import PassportScanScreen from '../screens/PassportScanScreen';
import PassportConfirmScreen from '../screens/PassportConfirmScreen';
import FaceScanScreen from '../screens/FaceScanScreen';
import FaceScanCameraScreen from '../screens/FaceScanCameraScreen';
import VerificationCompleteScreen from '../screens/VerificationCompleteScreen';
import HomeScreen from '../screens/HomeScreen';
import TravelPlanScreen from '../screens/TravelPlanScreen';
import ChargeScreen from '../screens/ChargeScreen';
import QRPayScreen from '../screens/QRPayScreen';

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
        <Stack.Screen name="PassportConfirm" component={PassportConfirmScreen} />
        <Stack.Screen name="FaceScan" component={FaceScanScreen} />
        <Stack.Screen name="FaceScanCamera" component={FaceScanCameraScreen} />
        <Stack.Screen name="VerificationComplete" component={VerificationCompleteScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TravelPlan" component={TravelPlanScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Charge" component={ChargeScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="QRPay" component={QRPayScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
