import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Ionicons name="shield-checkmark-outline" size={88} color="#15AFA4" />
        <Ionicons name="add" size={30} color="#15AFA4" style={styles.plus} />
      </View>

      <Text style={styles.logoText}>
        SAFE<Text style={styles.logoAccent}>PATH</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 154,
    height: 154,
    borderRadius: 42,
    backgroundColor: '#061728',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 54,
  },
  plus: {
    position: 'absolute',
    right: 32,
    top: 42,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 1,
  },
  logoAccent: {
    color: '#55CCC4',
  },
});