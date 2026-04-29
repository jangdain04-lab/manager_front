import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import OrganizerDashboard from '../screens/organizer/OrganizerDashboard';
import InteractiveMap from '../screens/organizer/InteractiveMap';
import EmergencyControl from '../screens/organizer/EmergencyControl';
import IncidentLogs from '../screens/organizer/IncidentLogs';
import SectorMonitoring from '../screens/organizer/SectorMonitoring';
import Settings from '../screens/organizer/Settings';
import { Colors } from '../components/Colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function OrganizerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, string> = {
            '대시보드': focused ? 'grid' : 'grid-outline',
            '인력배치': focused ? 'map' : 'map-outline',
            '긴급통제': focused ? 'warning' : 'warning-outline',
            '사고기록': focused ? 'document-text' : 'document-text-outline',
            '설정': focused ? 'settings' : 'settings-outline',
          };
          return <Ionicons name={(icons[route.name] || 'help') as any} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="대시보드" component={OrganizerDashboard} />
      <Tab.Screen name="인력배치" component={InteractiveMap} />
      <Tab.Screen name="긴급통제" component={EmergencyControl} />
      <Tab.Screen name="사고기록" component={IncidentLogs} />
      <Tab.Screen name="설정" component={Settings} />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrganizerTabs" component={OrganizerTabs} />
      <Stack.Screen name="SectorMonitoring" component={SectorMonitoring} />
      <Stack.Screen name="EmergencyControl" component={EmergencyControl} />
      <Stack.Screen name="InteractiveMap" component={InteractiveMap} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
