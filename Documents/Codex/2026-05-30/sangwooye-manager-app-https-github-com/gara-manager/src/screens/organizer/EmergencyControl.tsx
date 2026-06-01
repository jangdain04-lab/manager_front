import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  DEMO_REFRESH_INTERVAL_MS,
  getDemoSecond,
  getDemoStatusColor,
  getDemoStatusLabel,
  getDemoZones,
} from '../../data/demoData';

type TargetMode = 'zone' | 'all';
type MessageType = 'evacuate' | 'warning' | 'custom';

const THEME = {
  primary: '#55CCC4',
  primaryLight: '#EFFFFD',
  dark: '#111827',
  muted: '#8B95A1',
  white: '#FFFFFF',
  border: '#EEF1F4',
};

const MESSAGES = [
  {
    id: 'evacuate' as MessageType,
    title: '긴급 대피',
    desc: '즉시 해당 구역에서 벗어나 우회 동선을 이용해 주세요.',
    icon: 'warning-outline' as keyof typeof Ionicons.glyphMap,
    color: '#EF4444',
    bg: '#FFF1F1',
  },
  {
    id: 'warning' as MessageType,
    title: '주의 경고',
    desc: '혼잡이 예상됩니다. 천천히 이동하고 현장 안내를 따라 주세요.',
    icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
    color: '#F59E0B',
    bg: '#FFF8E8',
  },
  {
    id: 'custom' as MessageType,
    title: '커스텀 메시지',
    desc: '운영자가 직접 작성한 메시지를 전송합니다.',
    icon: 'paper-plane-outline' as keyof typeof Ionicons.glyphMap,
    color: THEME.primary,
    bg: THEME.primaryLight,
  },
];

export default function EmergencyControl() {
  const [demoSecond, setDemoSecond] = useState(getDemoSecond());
  const [targetMode, setTargetMode] = useState<TargetMode>('zone');
  const [selectedMessage, setSelectedMessage] = useState<MessageType>('custom');
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState('도서관 앞 혼잡이 증가하고 있습니다. 학생회관 방향으로 우회해 주세요.');

  useEffect(() => {
    const timer = setInterval(() => setDemoSecond(getDemoSecond()), DEMO_REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const zones = useMemo(() => getDemoZones(demoSecond), [demoSecond]);

  const toggleZone = (zoneName: string) => {
    setSelectedZones((prev) =>
      prev.includes(zoneName)
        ? prev.filter((name) => name !== zoneName)
        : [...prev, zoneName],
    );
  };

  const handleTargetMode = (mode: TargetMode) => {
    setTargetMode(mode);
    if (mode === 'all') setSelectedZones([]);
  };

  const sendAlert = (messageType: MessageType) => {
    const messageInfo = MESSAGES.find((message) => message.id === messageType);
    if (!messageInfo) return;

    if (targetMode === 'zone' && selectedZones.length === 0) {
      Alert.alert('구역 선택 필요', '알림을 보낼 구역을 1개 이상 선택해 주세요.');
      return;
    }

    if (messageType === 'custom' && customMessage.trim().length === 0) {
      Alert.alert('메시지 입력 필요', '커스텀 메시지를 입력해 주세요.');
      return;
    }

    const targetText = targetMode === 'all' ? '전체 방문객' : selectedZones.join(', ');
    const messageText = messageType === 'custom' ? customMessage.trim() : messageInfo.desc;

    Alert.alert('알림 전송 완료', `[대상]\n${targetText}\n\n[메시지]\n${messageText}`);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>비상 통제 센터</Text>
          <Text style={styles.subtitle}>원클릭 긴급 알림 발송</Text>
        </View>

        <Text style={styles.sectionTitle}>대상 선택</Text>
        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={[styles.segmentButton, targetMode === 'zone' && styles.segmentButtonActive]}
            onPress={() => handleTargetMode('zone')}
          >
            <Ionicons name="location-outline" size={21} color={targetMode === 'zone' ? THEME.white : THEME.muted} />
            <Text style={[styles.segmentText, targetMode === 'zone' && styles.segmentTextActive]}>특정 구역</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentButton, targetMode === 'all' && styles.segmentButtonActive]}
            onPress={() => handleTargetMode('all')}
          >
            <Ionicons name="people-outline" size={21} color={targetMode === 'all' ? THEME.white : THEME.muted} />
            <Text style={[styles.segmentText, targetMode === 'all' && styles.segmentTextActive]}>전체 방문객</Text>
          </TouchableOpacity>
        </View>

        {targetMode === 'zone' && (
          <View style={styles.zonePanel}>
            <View style={styles.zonePanelHeader}>
              <Text style={styles.zonePanelTitle}>구역 선택</Text>
              <Text style={styles.selectedCount}>{selectedZones.length}개 선택</Text>
            </View>
            <View style={styles.zoneGrid}>
              {zones.map((zone) => {
                const selected = selectedZones.includes(zone.name);
                return (
                  <TouchableOpacity
                    key={zone.id}
                    style={[styles.zoneChip, selected && styles.zoneChipSelected]}
                    onPress={() => toggleZone(zone.name)}
                  >
                    <View style={[styles.zoneDot, { backgroundColor: getDemoStatusColor(zone.status) }]} />
                    <Text style={styles.zoneName} numberOfLines={1}>{zone.name}</Text>
                    {selected && <Ionicons name="checkmark-circle" size={20} color={THEME.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>메시지 유형</Text>
        <View style={styles.messageList}>
          {MESSAGES.map((message) => {
            const selected = selectedMessage === message.id;
            return (
              <View key={message.id}>
                <TouchableOpacity
                  style={[styles.messageCard, selected && { borderColor: message.color }]}
                  onPress={() => setSelectedMessage(message.id)}
                >
                  <View style={[styles.messageIcon, { backgroundColor: message.bg }]}>
                    <Ionicons name={message.icon} size={30} color={message.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.messageTitle}>{message.title}</Text>
                    <Text style={styles.messageDesc}>{message.desc}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.sendCircle, { backgroundColor: selected ? message.color : '#DDE2E8' }]}
                    onPress={() => sendAlert(message.id)}
                  >
                    <Ionicons name="paper-plane-outline" size={22} color={THEME.white} />
                  </TouchableOpacity>
                </TouchableOpacity>

                {message.id === 'custom' && selected && (
                  <View style={styles.customBox}>
                    <TextInput
                      style={styles.customInput}
                      value={customMessage}
                      onChangeText={setCustomMessage}
                      multiline
                      textAlignVertical="top"
                    />
                    <TouchableOpacity style={styles.primaryButton} onPress={() => sendAlert('custom')}>
                      <Ionicons name="send-outline" size={19} color={THEME.white} />
                      <Text style={styles.primaryButtonText}>커스텀 메시지 전송</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: THEME.white },
  content: { paddingHorizontal: 20, paddingTop: 76, paddingBottom: 130 },
  header: { marginBottom: 34 },
  title: { color: THEME.dark, fontSize: 34, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { marginTop: 9, color: THEME.muted, fontSize: 15, fontWeight: '700' },
  sectionTitle: { color: THEME.dark, fontSize: 22, fontWeight: '900', marginBottom: 14 },
  segmentRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  segmentButton: { flex: 1, height: 64, borderRadius: 18, backgroundColor: '#F4F6F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  segmentButtonActive: { backgroundColor: THEME.primary },
  segmentText: { color: THEME.muted, fontSize: 16, fontWeight: '900' },
  segmentTextActive: { color: THEME.white },
  zonePanel: { borderRadius: 20, backgroundColor: '#F8FAFB', padding: 16, marginBottom: 28 },
  zonePanelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  zonePanelTitle: { color: THEME.dark, fontSize: 16, fontWeight: '900' },
  selectedCount: { color: THEME.primary, fontSize: 13, fontWeight: '900' },
  zoneGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  zoneChip: { width: '48%', minHeight: 54, borderRadius: 14, borderWidth: 1.3, borderColor: THEME.border, backgroundColor: THEME.white, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 13 },
  zoneChipSelected: { borderColor: THEME.primary, backgroundColor: THEME.primaryLight },
  zoneDot: { width: 11, height: 11, borderRadius: 6 },
  zoneName: { flex: 1, color: THEME.dark, fontSize: 15, fontWeight: '900' },
  messageList: { gap: 14 },
  messageCard: { minHeight: 104, borderRadius: 18, borderWidth: 1.5, borderColor: THEME.border, flexDirection: 'row', alignItems: 'center', padding: 16 },
  messageIcon: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  messageTitle: { color: THEME.dark, fontSize: 20, fontWeight: '900', marginBottom: 6 },
  messageDesc: { color: THEME.muted, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  sendCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  customBox: { marginTop: 10, borderRadius: 18, backgroundColor: THEME.primaryLight, borderWidth: 1.3, borderColor: '#BCEFEB', padding: 16 },
  customInput: { minHeight: 112, borderRadius: 14, backgroundColor: THEME.white, color: THEME.dark, fontSize: 15, fontWeight: '700', padding: 14, marginBottom: 12 },
  primaryButton: { height: 52, borderRadius: 14, backgroundColor: THEME.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: THEME.white, fontSize: 16, fontWeight: '900' },
});
