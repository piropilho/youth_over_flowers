import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Hana2-Light':   require('./assets/fonts/Hana2-Light.ttf'),
    'Hana2-Regular': require('./assets/fonts/Hana2-Regular.ttf'),
    'Hana2-Medium':  require('./assets/fonts/Hana2-Medium.ttf'),
    'Hana2-CM':      require('./assets/fonts/Hana2-CM.ttf'),
    'Hana2-Bold':    require('./assets/fonts/Hana2-Bold.ttf'),
    'Hana2-Heavy':   require('./assets/fonts/Hana2-Heavy.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#008485" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}
