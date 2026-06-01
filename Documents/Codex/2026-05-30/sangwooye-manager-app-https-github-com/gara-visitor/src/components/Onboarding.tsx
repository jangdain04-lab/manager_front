import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SPLASH_MS = 1300;

const COLORS = {
  text: '#111827',
  mint: '#7BCBC6',
};

export function OnboardingGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return <>{children}</>;
}

function SplashScreen() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(
    Math.max(Math.min(width, height) / 390, 0.88),
    1.16,
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.center}>
        <Image
          source={require('../../assets/safepath-logo.png')}
          style={[
            styles.logoImage,
            {
              width: 154 * scale,
              height: 154 * scale,
            },
          ]}
        />

        <Text style={[styles.brand, { fontSize: 43 * scale }]}>
          SAFE<Text style={styles.brandMint}>PATH</Text>
        </Text>
      </View>

      <View
        style={[
          styles.splashLoader,
          {
            bottom: Math.max(36, height * 0.055),
          },
        ]}
      >
        <ActivityIndicator color={COLORS.mint} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  splashLoader: {
    position: 'absolute',
    alignSelf: 'center',
  },

  logoImage: {
    resizeMode: 'contain',
  },

  brand: {
    color: COLORS.text,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 58,
  },

  brandMint: {
    color: COLORS.mint,
  },
});
