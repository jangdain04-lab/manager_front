import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../components/Colors';
import { DEMO_DENSITY_ROWS, DEMO_PLACES } from '../../data/demoData';

type IncidentLog = {
  id: string;
  time: string;
  date: string;
  sector: string;
  camera: string;
  count: number;
  duration: string;
  description: string;
  image: string;
  stats: { time: string; count: number; speedChange: number }[];
};

const INCIDENT_SEEDS = [
  {
    id: '1',
    rowIndex: 40,
    cameraIndex: 0,
    time: '14:32',
    date: '2026.05.30',
    duration: '8분 37초',
    description: '도서관 앞 이동 동선 병목으로 위험 단계가 감지되었습니다.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '2',
    rowIndex: 9,
    cameraIndex: 1,
    time: '15:10',
    date: '2026.05.30',
    duration: '5분 22초',
    description: '학생회관 앞 대기열 증가로 주의 알림을 발송했습니다.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '3',
    rowIndex: 58,
    cameraIndex: 3,
    time: '16:05',
    date: '2026.05.29',
    duration: '11분 08초',
    description: '공대 정류장 승하차 대기 인원이 증가해 우회 안내를 진행했습니다.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop',
  },
] as const;

function formatStatTime(baseTime: string, offset: number) {
  const [hours, minutes] = baseTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + offset * 2;
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
}

function buildIncident(seed: typeof INCIDENT_SEEDS[number]): IncidentLog {
  const place = DEMO_PLACES[seed.cameraIndex];
  const count = DEMO_DENSITY_ROWS[seed.rowIndex][seed.cameraIndex + 1];
  const stats = [-2, -1, 0, 1].map((offset) => {
    const index = Math.max(0, Math.min(DEMO_DENSITY_ROWS.length - 1, seed.rowIndex + offset));
    const previousIndex = Math.max(0, index - 1);
    const value = DEMO_DENSITY_ROWS[index][seed.cameraIndex + 1];
    const previous = DEMO_DENSITY_ROWS[previousIndex][seed.cameraIndex + 1];
    const speedChange = previous === 0 ? (value === 0 ? 0 : 100) : Math.round((Math.abs(value - previous) / previous) * 100);

    return {
      time: formatStatTime(seed.time, offset),
      count: value,
      speedChange,
    };
  });

  return {
    id: seed.id,
    time: seed.time,
    date: seed.date,
    sector: place.name,
    camera: place.camera,
    count,
    duration: seed.duration,
    description: seed.description,
    image: seed.image,
    stats,
  };
}

const INCIDENTS = INCIDENT_SEEDS.map(buildIncident);

const DANGER = '#D0453B';
const DANGER_LIGHT = '#FFF3F3';
const PRIMARY = '#55CCC4';
const PRIMARY_LIGHT = '#EFFFFD';
const DARK = '#111827';

export default function IncidentLogs() {
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026.05.30');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentLog | null>(null);

  const dates = Array.from(new Set(INCIDENTS.map((incident) => incident.date)));
  const filtered = INCIDENTS.filter((incident) => {
    const text = [incident.camera, incident.sector, incident.description].join(' ').toLowerCase();
    return incident.date === selectedDate && text.includes(search.trim().toLowerCase());
  });

  if (selectedIncident) {
    const maxCount = Math.max(...selectedIncident.stats.map((item) => item.count));
    const maxSpeedChange = Math.max(...selectedIncident.stats.map((item) => item.speedChange));

    return (
      <View style={styles.statsScreen}>
        <View style={styles.statsHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedIncident(null)}>
            <Ionicons name="arrow-back" size={25} color={DARK} />
          </TouchableOpacity>
          <View style={styles.statsHeaderIcon}>
            <Ionicons name="analytics-outline" size={25} color={Colors.white} />
          </View>
          <Text style={styles.statsTitle}>사건 통계 기록</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.statsScrollContent}>
          <View style={styles.statsSummaryCard}>
            <View style={styles.badge}><Text style={styles.badgeText}>위험</Text></View>
            <Text style={styles.statsIncidentTitle}>{selectedIncident.camera} · {selectedIncident.sector}</Text>
            <Text style={styles.statsDescription}>{selectedIncident.description}</Text>
            <Text style={styles.statsDateText}>{selectedIncident.date} {selectedIncident.time} · {selectedIncident.duration}</Text>
          </View>

          <Text style={styles.sectionTitle}>시간별 감지 인원</Text>
          <View style={styles.statsCard}>
            {selectedIncident.stats.map((item) => (
              <View key={`count-${item.time}`} style={styles.statRow}>
                <Text style={styles.statTime}>{item.time}</Text>
                <View style={styles.statBarBg}>
                  <View style={[styles.densityStatBar, { width: `${(item.count / maxCount) * 100}%` }]} />
                </View>
                <Text style={styles.statValue}>{item.count}명</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>급격한 속도 변화율</Text>
          <View style={styles.statsCard}>
            {selectedIncident.stats.map((item) => (
              <View key={`speed-${item.time}`} style={styles.statRow}>
                <Text style={styles.statTime}>{item.time}</Text>
                <View style={styles.statBarBg}>
                  <View style={[styles.speedStatBar, { width: `${(item.speedChange / maxSpeedChange) * 100}%` }]} />
                </View>
                <Text style={styles.statValue}>{item.speedChange}%</Text>
              </View>
            ))}
          </View>

          <View style={styles.statsInfoBox}>
            <Ionicons name="information-circle-outline" size={24} color={PRIMARY} />
            <Text style={styles.statsInfoText}>감지 인원과 속도 변화율이 동시에 높아진 시점은 위험도 상승 구간으로 판단됩니다.</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>사건 기록</Text>
            <View style={styles.badgeMini}><Text style={styles.badgeMiniText}>위험 {filtered.length}</Text></View>
          </View>
          <Text style={styles.subtitle}>자동 녹화 영상 및 대응 로그</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity style={styles.dateButton} onPress={() => setDateModalVisible(true)}>
            <View style={styles.dateButtonLeft}>
              <Ionicons name="calendar-outline" size={22} color={PRIMARY} />
              <Text style={styles.dateButtonText}>{selectedDate}</Text>
            </View>
            <Text style={styles.dateButtonSub}>날짜 변경</Text>
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={22} color={Colors.textMuted} />
            <TextInput style={styles.searchInput} placeholder="cam 또는 구역 검색..." placeholderTextColor={Colors.textMuted} value={search} onChangeText={setSearch} />
          </View>

          <Text style={styles.dateLabel}>{selectedDate}</Text>
          {filtered.map((incident, index) => (
            <View key={incident.id} style={styles.timelineRow}>
              <View style={styles.timelineRail}>
                <View style={styles.timelineDotOuter}><View style={styles.timelineDotInner} /></View>
                {index < filtered.length - 1 && <View style={styles.timelineLine} />}
              </View>

              <View style={styles.incidentCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.badge}><Text style={styles.badgeText}>위험</Text></View>
                  <View style={styles.timeRow}>
                    <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
                    <Text style={styles.timeText}>{incident.date} {incident.time}</Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>{incident.camera} · {incident.sector}</Text>
                <Text style={styles.description}>{incident.description}</Text>
                <View style={styles.imageWrap}>
                  <Image source={{ uri: incident.image }} style={styles.image} />
                  <View style={styles.durationBadge}><Text style={styles.durationText}>{incident.duration}</Text></View>
                </View>
                <View style={styles.densityBox}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.densityLabel}>최고 감지 인원</Text>
                    <View style={styles.densityBarBg}><View style={[styles.densityBarFill, { width: `${(incident.count / 18) * 100}%` }]} /></View>
                  </View>
                  <Text style={styles.densityValue}>{incident.count}명</Text>
                </View>
                <TouchableOpacity style={styles.recordButton} onPress={() => setSelectedIncident(incident)}>
                  <Ionicons name="stats-chart-outline" size={20} color={Colors.white} />
                  <Text style={styles.recordButtonText}>사건 기록 보기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.videoButton} onPress={() => Alert.alert('녹화 영상', `${incident.camera} 녹화 영상을 불러왔습니다.`)}>
                  <Ionicons name="videocam-outline" size={20} color={Colors.white} />
                  <Text style={styles.videoButtonText}>녹화 영상 보기</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={42} color={Colors.textMuted} />
              <Text style={styles.emptyText}>해당 날짜의 기록이 없습니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={dateModalVisible} transparent animationType="fade" onRequestClose={() => setDateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.dateModal}>
            <Text style={styles.dateModalTitle}>날짜 선택</Text>
            {dates.map((date) => (
              <TouchableOpacity key={date} style={[styles.dateOption, selectedDate === date && styles.dateOptionSelected]} onPress={() => { setSelectedDate(date); setDateModalVisible(false); }}>
                <Text style={[styles.dateOptionText, selectedDate === date && styles.dateOptionTextSelected]}>{date}</Text>
                {selectedDate === date && <Ionicons name="checkmark-circle" size={22} color={PRIMARY} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setDateModalVisible(false)}>
              <Text style={styles.modalCloseText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { paddingBottom: 108 },
  header: { paddingHorizontal: 28, paddingTop: 76, paddingBottom: 34, backgroundColor: Colors.white },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 34, fontWeight: '900', color: DARK, letterSpacing: 0 },
  badgeMini: { backgroundColor: '#FDECEC', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14, marginTop: 3 },
  badgeMiniText: { color: DANGER, fontSize: 15, fontWeight: '900' },
  subtitle: { marginTop: 10, fontSize: 17, color: Colors.textSecondary, fontWeight: '600' },
  content: { paddingHorizontal: 20, paddingTop: 4 },
  dateButton: { minHeight: 62, borderRadius: 18, backgroundColor: PRIMARY_LIGHT, borderWidth: 1.5, borderColor: '#BCEFEB', paddingHorizontal: 18, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateButtonLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateButtonText: { fontSize: 18, fontWeight: '900', color: DARK },
  dateButtonSub: { fontSize: 14, fontWeight: '800', color: PRIMARY },
  searchBox: { height: 62, borderRadius: 17, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 10, marginBottom: 24 },
  searchInput: { flex: 1, fontSize: 17, color: DARK, fontWeight: '600' },
  dateLabel: { fontSize: 22, color: Colors.textSecondary, fontWeight: '900', marginBottom: 14 },
  timelineRow: { flexDirection: 'row', alignItems: 'stretch', marginBottom: 22 },
  timelineRail: { width: 34, alignItems: 'center' },
  timelineDotOuter: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', elevation: 3, zIndex: 2 },
  timelineDotInner: { width: 16, height: 16, borderRadius: 8, backgroundColor: DANGER },
  timelineLine: { width: 2, flex: 1, backgroundColor: Colors.border, marginTop: 4 },
  incidentCard: { flex: 1, backgroundColor: DANGER_LIGHT, borderWidth: 1, borderColor: '#F3CFCF', borderRadius: 22, padding: 18 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  badge: { alignSelf: 'flex-start', backgroundColor: DANGER, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 12 },
  badgeText: { color: Colors.white, fontSize: 15, fontWeight: '900' },
  timeRow: { marginLeft: 10, flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  timeText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '800' },
  cardTitle: { fontSize: 23, color: DARK, fontWeight: '900', marginBottom: 8 },
  description: { fontSize: 16, color: DARK, fontWeight: '600', marginBottom: 14, lineHeight: 24 },
  imageWrap: { height: 142, borderRadius: 16, overflow: 'hidden', marginBottom: 14, backgroundColor: Colors.background },
  image: { width: '100%', height: '100%' },
  durationBadge: { position: 'absolute', right: 10, bottom: 8, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  durationText: { color: Colors.white, fontSize: 13, fontWeight: '900' },
  densityBox: { backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  densityLabel: { fontSize: 15, color: Colors.textSecondary, fontWeight: '900', marginBottom: 9 },
  densityBarBg: { height: 8, borderRadius: 4, backgroundColor: Colors.background, overflow: 'hidden' },
  densityBarFill: { height: '100%', borderRadius: 4, backgroundColor: DANGER },
  densityValue: { fontSize: 26, color: DANGER, fontWeight: '900' },
  recordButton: { height: 52, borderRadius: 14, backgroundColor: DANGER, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 },
  recordButtonText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  videoButton: { height: 52, borderRadius: 14, backgroundColor: PRIMARY, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  videoButtonText: { color: Colors.white, fontSize: 16, fontWeight: '900' },
  empty: { alignItems: 'center', paddingTop: 70 },
  emptyText: { marginTop: 10, fontSize: 16, color: Colors.textSecondary, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(17,24,39,0.45)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  dateModal: { width: '100%', borderRadius: 24, backgroundColor: Colors.white, padding: 24 },
  dateModalTitle: { fontSize: 24, fontWeight: '900', color: DARK, marginBottom: 18 },
  dateOption: { height: 58, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.background, paddingHorizontal: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateOptionSelected: { borderColor: PRIMARY, backgroundColor: PRIMARY_LIGHT },
  dateOptionText: { fontSize: 17, fontWeight: '800', color: Colors.textSecondary },
  dateOptionTextSelected: { color: DARK, fontWeight: '900' },
  modalCloseButton: { height: 54, borderRadius: 16, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  modalCloseText: { fontSize: 17, fontWeight: '900', color: Colors.white },
  statsScreen: { flex: 1, backgroundColor: '#F8F9FB' },
  statsHeader: { backgroundColor: Colors.white, paddingTop: 78, paddingHorizontal: 26, paddingBottom: 34, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEF0F3' },
  backButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F5F6F8', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  statsHeaderIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  statsTitle: { flex: 1, fontSize: 25, fontWeight: '900', color: DARK },
  statsScrollContent: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 120 },
  statsSummaryCard: { backgroundColor: Colors.white, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 28 },
  statsIncidentTitle: { fontSize: 24, fontWeight: '900', color: DARK, marginTop: 14, marginBottom: 8 },
  statsDescription: { fontSize: 17, fontWeight: '700', color: DARK, marginBottom: 8 },
  statsDateText: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: DARK, marginBottom: 14 },
  statsCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 28 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  statTime: { width: 54, fontSize: 15, fontWeight: '900', color: Colors.textSecondary },
  statBarBg: { flex: 1, height: 12, borderRadius: 6, backgroundColor: Colors.background, overflow: 'hidden', marginHorizontal: 12 },
  densityStatBar: { height: '100%', borderRadius: 6, backgroundColor: DANGER },
  speedStatBar: { height: '100%', borderRadius: 6, backgroundColor: PRIMARY },
  statValue: { width: 58, textAlign: 'right', fontSize: 15, fontWeight: '900', color: DARK },
  statsInfoBox: { backgroundColor: PRIMARY_LIGHT, borderRadius: 18, padding: 18, borderWidth: 1.5, borderColor: '#BCEFEB', flexDirection: 'row', gap: 10 },
  statsInfoText: { flex: 1, fontSize: 15, fontWeight: '700', color: DARK, lineHeight: 22 },
});
