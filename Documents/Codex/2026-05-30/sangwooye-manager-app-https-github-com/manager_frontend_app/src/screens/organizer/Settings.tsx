import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { DEMO_MAP_URL, DEMO_PLACES } from '../../data/demoData';

const THEME = {
  primary: '#55CCC4',
  primaryLight: '#EFFFFD',
  dark: '#111827',
  muted: '#8B95A1',
  white: '#FFFFFF',
  border: '#EEF1F4',
  danger: '#EF4444',
};

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [demoLoopEnabled, setDemoLoopEnabled] = useState(true);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>설정</Text>
          <Text style={styles.subtitle}>시연 영상용 데모 구성</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={THEME.primary} />
          </View>
          <View>
            <Text style={styles.profileName}>GARA 운영자</Text>
            <Text style={styles.profileEmail}>demo@gara.local</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>데모 지도</Text>
        <View style={styles.mapCard}>
          <View style={styles.mapBox}>
            <WebView
              source={{ uri: DEMO_MAP_URL }}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              geolocationEnabled
              originWhitelist={['*']}
              mixedContentMode="always"
            />
          </View>
          <Text style={styles.mapUrl}>{DEMO_MAP_URL}</Text>
        </View>

        <Text style={styles.sectionTitle}>고정 구역</Text>
        <View style={styles.sectionCard}>
          {DEMO_PLACES.map((place, index) => (
            <View key={place.id} style={[styles.placeRow, index < DEMO_PLACES.length - 1 && styles.borderBottom]}>
              <View style={styles.placeIndex}>
                <Text style={styles.placeIndexText}>{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeSub}>{place.camera} · CCTV 고정</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>앱 동작</Text>
        <View style={styles.sectionCard}>
          <SettingToggle
            icon="notifications"
            label="푸시 알림 시연"
            value={notificationsEnabled}
            onChange={setNotificationsEnabled}
          />
          <SettingToggle
            icon="volume-high"
            label="알림음"
            value={soundEnabled}
            onChange={setSoundEnabled}
          />
          <SettingToggle
            icon="repeat"
            label="60초 데이터 반복"
            value={demoLoopEnabled}
            onChange={setDemoLoopEnabled}
          />
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => Alert.alert('데모 초기화', '시연용 앱 상태가 초기화된 것처럼 표시됩니다.')}
        >
          <Ionicons name="refresh" size={18} color={THEME.danger} />
          <Text style={styles.resetText}>데모 상태 초기화</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SettingToggle({
  icon,
  label,
  value,
  onChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color={THEME.primary} />
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: THEME.border, true: THEME.primary }}
        thumbColor={THEME.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFB' },
  content: { paddingHorizontal: 22, paddingTop: 66, paddingBottom: 120 },
  header: { marginBottom: 22 },
  title: { color: THEME.dark, fontSize: 34, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { color: THEME.muted, fontSize: 15, fontWeight: '700', marginTop: 8 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 22, backgroundColor: THEME.white, padding: 22, marginBottom: 24 },
  avatar: { width: 66, height: 66, borderRadius: 33, backgroundColor: THEME.primaryLight, alignItems: 'center', justifyContent: 'center' },
  profileName: { color: THEME.dark, fontSize: 21, fontWeight: '900' },
  profileEmail: { color: THEME.muted, fontSize: 14, fontWeight: '700', marginTop: 4 },
  sectionTitle: { color: THEME.muted, fontSize: 15, fontWeight: '900', marginBottom: 10, marginLeft: 4 },
  mapCard: { borderRadius: 22, backgroundColor: THEME.white, padding: 14, marginBottom: 24 },
  mapBox: { height: 260, borderRadius: 18, overflow: 'hidden', backgroundColor: '#F3F4F6', marginBottom: 10 },
  webview: { flex: 1 },
  mapUrl: { color: THEME.muted, fontSize: 12, fontWeight: '700' },
  sectionCard: { borderRadius: 20, backgroundColor: THEME.white, overflow: 'hidden', marginBottom: 24 },
  placeRow: { minHeight: 74, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: THEME.border },
  placeIndex: { width: 34, height: 34, borderRadius: 17, backgroundColor: THEME.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  placeIndexText: { color: THEME.primary, fontSize: 14, fontWeight: '900' },
  placeName: { color: THEME.dark, fontSize: 17, fontWeight: '900' },
  placeSub: { color: THEME.muted, fontSize: 13, fontWeight: '700', marginTop: 3 },
  settingRow: { minHeight: 76, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: THEME.border },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: THEME.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  settingLabel: { color: THEME.dark, fontSize: 17, fontWeight: '900' },
  resetButton: { height: 56, borderRadius: 16, backgroundColor: '#FFF1F1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  resetText: { color: THEME.danger, fontSize: 16, fontWeight: '900' },
});
