import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IncidentLog = {
  id: string;
  time: string;
  date: string;
  sector: string;
  camera: string;
  density: number;
  duration: string;
  description: string;
  stats: { time: string; density: number; speedChange: number }[];
};

const INCIDENTS: IncidentLog[] = [
  {
    id: '1',
    time: '14:32',
    date: '2026.05.30',
    sector: '도서관 앞',
    camera: 'cam 1',
    density: 108,
    duration: '8분 37초',
    description: '도서관 앞 이동 동선 병목으로 위험 단계가 감지되었습니다.',
    stats: [
      { time: '14:28', density: 64, speedChange: 12 },
      { time: '14:30', density: 81, speedChange: 24 },
      { time: '14:32', density: 108, speedChange: 43 },
      { time: '14:34', density: 93, speedChange: 31 },
    ],
  },
  {
    id: '2',
    time: '15:10',
    date: '2026.05.30',
    sector: '학생회관 앞',
    camera: 'cam 2',
    density: 89,
    duration: '5분 22초',
    description: '학생회관 앞 대기열 증가로 주의 알림을 발송했습니다.',
    stats: [
      { time: '15:04', density: 42, speedChange: 10 },
      { time: '15:06', density: 61, speedChange: 18 },
      { time: '15:08', density: 76, speedChange: 28 },
      { time: '15:10', density: 89, speedChange: 33 },
    ],
  },
  {
    id: '3',
    time: '16:05',
    date: '2026.05.30',
    sector: '공대 정류장',
    camera: 'cam 4',
    density: 96,
    duration: '11분 08초',
    description: '공대 정류장 승하차 대기 인원이 증가해 우회 안내를 진행했습니다.',
    stats: [
      { time: '15:58', density: 52, speedChange: 14 },
      { time: '16:01', density: 74, speedChange: 27 },
      { time: '16:05', density: 96, speedChange: 39 },
      { time: '16:09', density: 84, speedChange: 25 },
    ],
  },
];

const THEME = {
  primary: '#55CCC4',
  primaryLight: '#EFFFFD',
  dark: '#111827',
  muted: '#8B95A1',
  white: '#FFFFFF',
  border: '#EEF1F4',
  danger: '#EF4444',
};

export default function IncidentLogs() {
  const [search, setSearch] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<IncidentLog | null>(null);

  const filtered = INCIDENTS.filter((incident) =>
    [incident.sector, incident.camera, incident.description]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>사건 기록</Text>
            <View style={styles.badgeMini}>
              <Text style={styles.badgeMiniText}>{filtered.length}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>시연용 자동 감지 로그</Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={21} color={THEME.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="cam 또는 구역 검색"
            placeholderTextColor={THEME.muted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {filtered.map((incident, index) => (
          <View key={incident.id} style={styles.timelineRow}>
            <View style={styles.timelineRail}>
              <View style={styles.timelineDot} />
              {index < filtered.length - 1 && <View style={styles.timelineLine} />}
            </View>

            <TouchableOpacity style={styles.incidentCard} onPress={() => setSelectedIncident(incident)}>
              <View style={styles.cardHeader}>
                <View style={styles.dangerBadge}>
                  <Text style={styles.dangerBadgeText}>위험</Text>
                </View>
                <Text style={styles.timeText}>{incident.date} {incident.time}</Text>
              </View>
              <Text style={styles.cardTitle}>{incident.camera} · {incident.sector}</Text>
              <Text style={styles.description}>{incident.description}</Text>
              <View style={styles.metricRow}>
                <View>
                  <Text style={styles.metricLabel}>최고 감지 인원</Text>
                  <Text style={styles.metricValue}>{incident.density}명</Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>지속 시간</Text>
                  <Text style={styles.metricValue}>{incident.duration}</Text>
                </View>
              </View>
              <View style={styles.recordButton}>
                <Ionicons name="stats-chart-outline" size={19} color={THEME.white} />
                <Text style={styles.recordButtonText}>통계 보기</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={!!selectedIncident} animationType="slide" onRequestClose={() => setSelectedIncident(null)}>
        {!!selectedIncident && (
          <View style={styles.detailScreen}>
            <View style={styles.detailHeader}>
              <TouchableOpacity style={styles.backButton} onPress={() => setSelectedIncident(null)}>
                <Ionicons name="arrow-back" size={24} color={THEME.dark} />
              </TouchableOpacity>
              <View>
                <Text style={styles.detailTitle}>사건 통계 기록</Text>
                <Text style={styles.detailSubtitle}>{selectedIncident.camera} · {selectedIncident.sector}</Text>
              </View>
            </View>

            <ScrollView contentContainerStyle={styles.detailContent}>
              <View style={styles.summaryCard}>
                <Text style={styles.cardTitle}>{selectedIncident.description}</Text>
                <Text style={styles.timeText}>{selectedIncident.date} {selectedIncident.time} · {selectedIncident.duration}</Text>
              </View>

              <Text style={styles.sectionTitle}>시간별 감지 인원</Text>
              <View style={styles.statsCard}>
                {selectedIncident.stats.map((item) => (
                  <View key={item.time} style={styles.statRow}>
                    <Text style={styles.statTime}>{item.time}</Text>
                    <View style={styles.statBarBg}>
                      <View style={[styles.densityBar, { width: `${Math.min(100, item.density)}%` }]} />
                    </View>
                    <Text style={styles.statValue}>{item.density}명</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>속도 변화율</Text>
              <View style={styles.statsCard}>
                {selectedIncident.stats.map((item) => (
                  <View key={`${item.time}-speed`} style={styles.statRow}>
                    <Text style={styles.statTime}>{item.time}</Text>
                    <View style={styles.statBarBg}>
                      <View style={[styles.speedBar, { width: `${Math.min(100, item.speedChange * 2)}%` }]} />
                    </View>
                    <Text style={styles.statValue}>{item.speedChange}%</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: THEME.white },
  content: { paddingHorizontal: 20, paddingTop: 66, paddingBottom: 110 },
  header: { marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { color: THEME.dark, fontSize: 34, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { color: THEME.muted, fontSize: 15, fontWeight: '700', marginTop: 8 },
  badgeMini: { backgroundColor: '#FFF1F1', borderRadius: 13, paddingHorizontal: 12, paddingVertical: 6 },
  badgeMiniText: { color: THEME.danger, fontSize: 14, fontWeight: '900' },
  searchBox: { height: 58, borderRadius: 16, backgroundColor: '#F8FAFB', borderWidth: 1, borderColor: THEME.border, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, marginBottom: 22 },
  searchInput: { flex: 1, color: THEME.dark, fontSize: 16, fontWeight: '700' },
  timelineRow: { flexDirection: 'row', marginBottom: 18 },
  timelineRail: { width: 30, alignItems: 'center' },
  timelineDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: THEME.danger },
  timelineLine: { width: 2, flex: 1, backgroundColor: THEME.border, marginTop: 5 },
  incidentCard: { flex: 1, borderRadius: 20, backgroundColor: '#FFF7F7', borderWidth: 1, borderColor: '#F3CFCF', padding: 17 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  dangerBadge: { backgroundColor: THEME.danger, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  dangerBadgeText: { color: THEME.white, fontSize: 13, fontWeight: '900' },
  timeText: { color: THEME.muted, fontSize: 13, fontWeight: '800' },
  cardTitle: { color: THEME.dark, fontSize: 21, fontWeight: '900', marginBottom: 8 },
  description: { color: '#566173', fontSize: 15, lineHeight: 22, fontWeight: '700', marginBottom: 14 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: THEME.white, borderRadius: 14, padding: 14, marginBottom: 12 },
  metricLabel: { color: THEME.muted, fontSize: 12, fontWeight: '800', marginBottom: 5 },
  metricValue: { color: THEME.danger, fontSize: 20, fontWeight: '900' },
  recordButton: { height: 48, borderRadius: 14, backgroundColor: THEME.danger, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  recordButtonText: { color: THEME.white, fontSize: 15, fontWeight: '900' },
  detailScreen: { flex: 1, backgroundColor: '#F8FAFB' },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: THEME.white, paddingHorizontal: 22, paddingTop: 62, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: THEME.border },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  detailTitle: { color: THEME.dark, fontSize: 25, fontWeight: '900' },
  detailSubtitle: { color: THEME.muted, fontSize: 13, fontWeight: '700', marginTop: 4 },
  detailContent: { padding: 22, paddingBottom: 120 },
  summaryCard: { borderRadius: 20, backgroundColor: THEME.white, padding: 18, marginBottom: 24 },
  sectionTitle: { color: THEME.dark, fontSize: 21, fontWeight: '900', marginBottom: 12 },
  statsCard: { borderRadius: 18, backgroundColor: THEME.white, padding: 16, marginBottom: 24 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  statTime: { width: 54, color: THEME.muted, fontSize: 13, fontWeight: '900' },
  statBarBg: { flex: 1, height: 11, borderRadius: 6, backgroundColor: '#F3F4F6', overflow: 'hidden', marginHorizontal: 10 },
  densityBar: { height: '100%', borderRadius: 6, backgroundColor: THEME.danger },
  speedBar: { height: '100%', borderRadius: 6, backgroundColor: THEME.primary },
  statValue: { width: 56, textAlign: 'right', color: THEME.dark, fontSize: 13, fontWeight: '900' },
});
