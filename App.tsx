import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SplashScreen } from './screens/Splash';
import { LoginScreen, ProfilePictureSetupScreen, RegisterScreen } from './screens/AuthScreens';
import { OnboardingScreen } from './screens/Onboarding';
import { DashboardScreen } from './screens/Dashboard';
import { CattleConditionSelectionScreen, CattleTypeSelectionScreen, FeedSampleUploadScreen } from './screens/FeedTestProfileFlow';
import { SampleTestingScreen } from './screens/SampleTesting';
import { ResultsScreen } from './screens/Results';
import { HistoryScreen } from './screens/History';
import { AdvisoryScreen } from './screens/Advisory';
import { ProfileScreen } from './screens/Profile';

import { GlassDrawerContent } from './components/GlassDrawerContent';
import { AuthProvider, useAuth } from './context/AuthContext';
import { colors } from './theme/colors';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <GlassDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: 'transparent',
          width: '80%',
        },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen 
        name="CattleTypeSelection" 
        component={CattleTypeSelectionScreen} 
        options={{ title: 'Test Feed' }}
      />
      <Drawer.Screen 
        name="CattleConditionSelection" 
        component={CattleConditionSelectionScreen} 
        options={{ title: 'Test Feed' }}
      />
      <Drawer.Screen 
        name="FeedSampleUpload" 
        component={FeedSampleUploadScreen} 
        options={{ title: 'Test Feed' }}
      />
      <Drawer.Screen 
        name="TestFeed" 
        component={SampleTestingScreen} 
        initialParams={{ sampleType: 'Feed' }} 
        options={{ title: 'Test Feed' }}
      />
      <Drawer.Screen 
        name="TestSilage" 
        component={SampleTestingScreen} 
        initialParams={{ sampleType: 'Silage' }} 
        options={{ title: 'Test Silage' }}
      />
      <Drawer.Screen name="History" component={HistoryScreen} />
      <Drawer.Screen name="Advisory" component={AdvisoryScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      {/* Missing ones map back to Dashboard for now */}
      <Drawer.Screen name="ConnectedDevices" component={DashboardScreen} />
      <Drawer.Screen name="HelpSupport" component={DashboardScreen} />
      <Drawer.Screen name="LanguageSelector" component={OnboardingScreen} />
    </Drawer.Navigator>
  );
};

const RootNavigator = () => {
  const { user, loading, pendingProfileSetup } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.background } }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : pendingProfileSetup ? (
        <Stack.Screen name="ProfilePictureSetup" component={ProfilePictureSetupScreen} />
      ) : (
        <>
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
          <Stack.Screen name="TestResults" component={ResultsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
