import 'react-native-url-polyfill/auto';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Dashboard } from './src/components/Dashboard';
import { HeatmapView } from './src/components/HeatmapView';
import { Notifications } from './src/components/Notifications';
import { FestivalInfo } from './src/components/FestivalInfo';
import { MissingChildDetail } from './src/components/MissingChildDetail';
import { OnboardingGate } from './src/components/Onboarding';

type RootStackParamList = {
  Dashboard: undefined;
  FestivalInfo: undefined;
  MissingChildDetail: undefined;
};

type TabParamList = {
  HomeTab: undefined;
  MonitorTab: undefined;
  AlertsTab: undefined;
};

const HomeStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Dashboard" component={Dashboard} />
      <HomeStack.Screen name="FestivalInfo" component={FestivalInfo} />
      <HomeStack.Screen name="MissingChildDetail" component={MissingChildDetail} />
    </HomeStack.Navigator>
  );
}

function tabIcon(routeName: keyof TabParamList, focused: boolean): keyof typeof Ionicons.glyphMap {
  const icons: Record<keyof TabParamList, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
    HomeTab: ['home', 'home-outline'],
    MonitorTab: ['map', 'map-outline'],
    AlertsTab: ['notifications', 'notifications-outline'],
  };
  return focused ? icons[routeName][0] : icons[routeName][1];
}

export default function App() {
  return (
    <SafeAreaProvider>
      <OnboardingGate>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#F2F4F6',
                height: 86,
                paddingTop: 9,
                paddingBottom: 18,
                shadowColor: 'transparent',
                elevation: 0,
              },
              tabBarActiveTintColor: '#7BCBC6',
              tabBarInactiveTintColor: '#ADB5BD',
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '700',
                marginTop: 2,
              },
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={tabIcon(route.name, focused)} size={28} color={color} />
              ),
            })}
          >
            <Tab.Screen name="HomeTab" component={HomeNavigator} options={{ tabBarLabel: '홈' }} />
            <Tab.Screen name="MonitorTab" component={HeatmapView} options={{ tabBarLabel: '모니터링' }} />
            <Tab.Screen name="AlertsTab" component={Notifications} options={{ tabBarLabel: '알림' }} />
          </Tab.Navigator>
        </NavigationContainer>
      </OnboardingGate>
    </SafeAreaProvider>
  );
}
