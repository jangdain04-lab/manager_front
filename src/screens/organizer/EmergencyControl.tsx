import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, getRiskColor } from '../../components/Colors';

const SECTORS = [
  { id: 'a', name: 'Sector A', density: 88, level: 'critical' },
  { id: 'b', name: 'Sector B', density: 45, level: 'safe' },
  { id: 'c', name: 'Sector C', density: 72, level: 'warning' },
  { id: 'd', name: 'Sector D', density: 38, level: 'safe' },
  { id: 'e', name: 'Sector E', density: 62, level: 'warning' },
];

const PRESET_MESSAGES = [
  { id: '1', text: 'Sector A 즉시 대피하세요', type: 'evacuate' },
  { id: '2', text: '혼잡 구역 진입을 자제해 주세요', type: 'caution' },
  { id: '3', text: '안전한 대체 경로로 이동해 주세요', type: 'redirect' },
  { id: '4', text: '현재 위치에서 대기해 주세요', type: 'wait' },
];

export default function EmergencyControl() {
  const navigation = useNavigation();
  const [selectedTarget, setSelectedTarget] = useState<'all' | 'sector'>('all');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedMessage, setSelectedMessage] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sirenEnabled, setSirenEnabled] = useState(false);

  const sendEmergencyAlert = () => {
    const message = selectedMessage || customMessage;
    if (!message) {
      Alert.alert('알림 메시지를 선택하거나 직접 입력해주세요.');
      return;
    }
    Alert.alert(
      '긴급 알림 발송',
      `메시지: ${message}\n대상: ${selectedTarget === 'all' ? '전체' : selectedSector}`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '발송', style: 'destructive',
          onPress: () => {
            setSelectedMessage('');
            setCustomMessage('');
            Alert.alert('발송 완료', '긴급 알림이 발송되었습니다.');
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>긴급 통제</Text>
          <Text style={styles.subtitle}>긴급 상황 대응 및 알림 발송</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 24 }}>
        {/* Siren Toggle */}
        <View style={styles.sirenCard}>
          <View style={styles.sirenLeft}>
            <View style={[styles.sirenIcon, sirenEnabled ? styles.sirenActive : styles.sirenInactive]}>
              <Ionicons name="warning" size={24} color={sirenEnabled ? Colors.white : Colors.textSecondary} />
            </View>
            <View>
              <Text style={styles.sirenTitle}>사이렌 경보</Text>
              <Text style={styles.sirenSubtitle}>{sirenEnabled ? '경보 활성화됨' : '비활성화'}</Text>
            </View>
          </View>
          <Switch
            value={sirenEnabled}
            onValueChange={setSirenEnabled}
            trackColor={{ false: Colors.border, true: Colors.danger }}
            thumbColor={Colors.white}
          />
        </View>

        {/* Target Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 대상</Text>
          <View style={styles.targetRow}>
            <TouchableOpacity
              style={[styles.targetBtn, selectedTarget === 'all' && styles.targetBtnActive]}
              onPress={() => setSelectedTarget('all')}
            >
              <Ionicons name="people" size={16} color={selectedTarget === 'all' ? Colors.white : Colors.primary} />
              <Text style={[styles.targetBtnText, selectedTarget === 'all' && styles.targetBtnTextActive]}>전체 구역</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.targetBtn, selectedTarget === 'sector' && styles.targetBtnActive]}
              onPress={() => setSelectedTarget('sector')}
            >
              <Ionicons name="map" size={16} color={selectedTarget === 'sector' ? Colors.white : Colors.primary} />
              <Text style={[styles.targetBtnText, selectedTarget === 'sector' && styles.targetBtnTextActive]}>특정 구역</Text>
            </TouchableOpacity>
          </View>
          {selectedTarget === 'sector' && (
            <View style={styles.sectorList}>
              {SECTORS.map(s => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.sectorItem, selectedSector === s.id && styles.sectorItemSelected]}
                  onPress={() => setSelectedSector(s.id)}
                >
                  <View style={[styles.sectorDot, { backgroundColor: getRiskColor(s.level) }]} />
                  <Text style={styles.sectorItemText}>{s.name}</Text>
                  <Text style={styles.sectorDensity}>{s.density}%</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Preset Messages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 메시지</Text>
          {PRESET_MESSAGES.map(msg => (
            <TouchableOpacity
              key={msg.id}
              style={[styles.msgItem, selectedMessage === msg.text && styles.msgItemSelected]}
              onPress={() => setSelectedMessage(selectedMessage === msg.text ? '' : msg.text)}
            >
              <View style={[styles.msgRadio, selectedMessage === msg.text && styles.msgRadioSelected]}>
                {selectedMessage === msg.text && <View style={styles.msgRadioDot} />}
              </View>
              <Text style={[styles.msgText, selectedMessage === msg.text && { color: Colors.primary }]}>
                {msg.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>직접 입력</Text>
          <TextInput
            style={styles.input}
            placeholder="긴급 메시지를 직접 입력하세요..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={3}
            value={customMessage}
            onChangeText={setCustomMessage}
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity style={styles.sendBtn} onPress={sendEmergencyAlert}>
          <Ionicons name="megaphone" size={20} color={Colors.white} />
          <Text style={styles.sendBtnText}>긴급 알림 발송</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textSecondary },
  sirenCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.background, borderRadius: 16, padding: 16, marginTop: 20, marginBottom: 8 },
  sirenLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sirenIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  sirenActive: { backgroundColor: Colors.danger },
  sirenInactive: { backgroundColor: '#E5E7EB' },
  sirenTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  sirenSubtitle: { fontSize: 12, color: Colors.textSecondary },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  targetRow: { flexDirection: 'row', gap: 10 },
  targetBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 12, padding: 12 },
  targetBtnActive: { backgroundColor: Colors.primary },
  targetBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  targetBtnTextActive: { color: Colors.white },
  sectorList: { marginTop: 10, gap: 8 },
  sectorItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.background, borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: 'transparent' },
  sectorItemSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  sectorDot: { width: 10, height: 10, borderRadius: 5 },
  sectorItemText: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text },
  sectorDensity: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  msgItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.background, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1.5, borderColor: 'transparent' },
  msgItemSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  msgRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  msgRadioSelected: { borderColor: Colors.primary },
  msgRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  msgText: { flex: 1, fontSize: 14, color: Colors.text },
  input: { backgroundColor: Colors.background, borderRadius: 14, padding: 14, fontSize: 14, color: Colors.text, height: 90, textAlignVertical: 'top', borderWidth: 1.5, borderColor: Colors.border },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.danger, borderRadius: 16, padding: 18, marginTop: 24 },
  sendBtnText: { fontSize: 16, fontWeight: '800', color: Colors.white },
});
