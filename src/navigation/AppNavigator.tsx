import React from 'react';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import OnboardingFlow from '../screens/onboarding/OnboardingFlow';

import OrganizerDashboard from '../screens/organizer/OrganizerDashboard';
import InteractiveMap from '../screens/organizer/InteractiveMap';
import EmergencyControl from '../screens/organizer/EmergencyControl';
import IncidentLogs from '../screens/organizer/IncidentLogs';
import Settings from '../screens/organizer/Settings';
import SectorMonitoring from '../screens/organizer/SectorMonitoring';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 84,
          paddingTop: 8,
          paddingBottom: 18,
          borderTopColor: '#EEF0F3',
        },
        tabBarLabel: ({ color }) => {
          const label =
            route.name === 'OrganizerDashboard' ? '홈' :
            route.name === 'InteractiveMap' ? '인력 관리' :
            route.name === 'EmergencyControl' ? '비상 통제' :
            route.name === 'IncidentLogs' ? '사건 기록' : '설정';

          return <Text style={{ color, fontSize: 11, fontWeight: '700' }}>{label}</Text>;
        },
        tabBarIcon: ({ color }) => {
          const icon =
            route.name === 'OrganizerDashboard' ? 'home-outline' :
            route.name === 'InteractiveMap' ? 'people-outline' :
            route.name === 'EmergencyControl' ? 'alert-circle-outline' :
            route.name === 'IncidentLogs' ? 'document-text-outline' : 'settings-outline';

          return <Ionicons name={icon as any} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#2F80ED',
        tabBarInactiveTintColor: '#A8B0BA',
      })}
    >
      <Tab.Screen name="OrganizerDashboard" component={OrganizerDashboard} />
      <Tab.Screen name="InteractiveMap" component={InteractiveMap} />
      <Tab.Screen name="EmergencyControl" component={EmergencyControl} />
      <Tab.Screen name="IncidentLogs" component={IncidentLogs} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingFlow} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="SectorMonitoring" component={SectorMonitoring} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}