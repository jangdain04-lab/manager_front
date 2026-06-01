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
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  DemoZone,
  getDemoSecond,
  getDemoStatusBg,
  getDemoStatusColor,
  getDemoStatusLabel,
  getDemoZones,
} from '../../data/demoData';

const COLORS = {
  primary: '#55CCC4',
  primaryLight: '#EFFFFD',
  dark: '#111827',
  gray: '#8B95A1',
  border: '#EEF1F4',
  white: '#FFFFFF',
  danger: '#EF4444',
};

type Notice = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const initialNotices: Notice[] = [
  {
    id: 1,
    title: '도서관 앞 혼잡 안내',
    content: '도서관 앞 밀집도가 높아지고 있습니다. 학생회관 앞 우회 동선을 안내해 주세요.',
    createdAt: '2026.05.30 14:20',
  },
  {
    id: 2,
    title: '공대 정류장 승하차 위치 변경',
    content: '공대 정류장 대기열이 길어져 임시 승하차 위치를 운영합니다.',
    createdAt: '2026.05.30 13:45',
  },
];

function formatClock(second: number) {
  return `00:${String(second + 1).padStart(2, '0')}`;
}

function getMostCrowded(zones: DemoZone[]) {
  return [...zones].sort((a, b) => b.rawDensity - a.rawDensity)[0];
}

export default function OrganizerDashboard({ navigation }: any) {
  const [demoSecond, setDemoSecond] = useState(getDemoSecond());
  const [noticeMode, setNoticeMode] = useState(false);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setDemoSecond(getDemoSecond()), 1000);
    return () => clearInterval(timer);
  }, []);

  const zones = useMemo(() => getDemoZones(demoSecond), [demoSecond]);
  const mostCrowded = getMostCrowded(zones);
  const dangerCount = zones.filter((zone) => zone.status === 'danger').length;
  const totalPeople = zones.reduce((sum, zone) => sum + zone.count, 0);

  const goToStaffTab = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'MainTabs',
        params: { screen: 'SectorMonitoringTab' },
      }),
    );
  };

  const resetNoticeForm = () => {
    setNoticeTitle('');
    setNoticeContent('');
    setEditingNoticeId(null);
  };

  const saveNotice = () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      Alert.alert('입력 필요', '공지 제목과 내용을 모두 입력해 주세요.');
      return;
    }

    if (editingNoticeId) {
      setNotices((prev) =>
        prev.map((notice) =>
          notice.id === editingNoticeId
            ? { ...notice, title: noticeTitle.trim(), content: noticeContent.trim() }
            : notice,
        ),
      );
      Alert.alert('수정 완료', '공지사항이 수정되었습니다.');
    } else {
      const now = new Date();
      setNotices((prev) => [
        {
          id: Date.now(),
          title: noticeTitle.trim(),
          content: noticeContent.trim(),
          createdAt: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        },
        ...prev,
      ]);
      Alert.alert('등록 완료', '공지사항이 등록되었습니다.');
    }

    resetNoticeForm();
  };

  const editNotice = (notice: Notice) => {
    setEditingNoticeId(notice.id);
    setNoticeTitle(notice.title);
    setNoticeContent(notice.content);
  };

  if (noticeMode) {
    return (
      <View style={styles.screen}>
        <View style={styles.headerCompact}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setNoticeMode(false)}>
            <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>공지사항 관리</Text>
            <Text style={styles.subtitle}>시연 중 눌러볼 수 있는 데모 공지 작성</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.writeCard}>
            <Text style={styles.sectionTitle}>{editingNoticeId ? '공지 수정' : '새 공지 작성'}</Text>
            <TextInput
              style={styles.input}
              placeholder="공지 제목"
              placeholderTextColor="#AEB6C2"
              value={noticeTitle}
              onChangeText={setNoticeTitle}
            />
            <TextInput
              style={styles.textarea}
              placeholder="공지 내용"
              placeholderTextColor="#AEB6C2"
              value={noticeContent}
              onChangeText={setNoticeContent}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.primaryButton} onPress={saveNotice}>
              <Ionicons name="send-outline" size={19} color={COLORS.white} />
              <Text style={styles.primaryButtonText}>{editingNoticeId ? '수정 완료' : '공지 등록'}</Text>
            </TouchableOpacity>
          </View>

          {notices.map((notice) => (
            <View key={notice.id} style={styles.noticeCard}>
              <Text style={styles.noticeTitle}>{notice.title}</Text>
              <Text style={styles.noticeDate}>{notice.createdAt}</Text>
              <Text style={styles.noticeContent}>{notice.content}</Text>
              <View style={styles.rowGap}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => editNotice(notice)}>
                  <Ionicons name="pencil-outline" size={17} color={COLORS.primary} />
                  <Text style={styles.secondaryButtonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setNotices((prev) => prev.filter((item) => item.id !== notice.id))}
                >
                  <Ionicons name="trash-outline" size={17} color={COLORS.danger} />
                  <Text style={styles.deleteButtonText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>GARA MANAGER</Text>
            <Text style={styles.title}>실시간 안전 대시보드</Text>
            <Text style={styles.subtitle}>1분 데모 데이터 반복 재생 중 · {formatClock(demoSecond)}</Text>
          </View>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>총 감지 인원</Text>
            <Text style={styles.summaryValue}>{totalPeople}명</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>위험 구역</Text>
            <Text style={[styles.summaryValue, { color: COLORS.danger }]}>{dangerCount}곳</Text>
          </View>
        </View>

        <View style={styles.predictionCard}>
          <View style={[styles.predictionIcon, { backgroundColor: getDemoStatusColor(mostCrowded.status) }]}>
            <Ionicons name="warning-outline" size={28} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.predictionTitle}>{mostCrowded.name} 집중 모니터링</Text>
            <Text style={styles.predictionText}>
              현재 {getDemoStatusLabel(mostCrowded.status)} 단계 · 감지 {mostCrowded.count}명
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>구역별 히트맵</Text>
        <View style={styles.heatmapGrid}>
          {zones.map((zone) => (
            <View key={zone.id} style={[styles.heatmapCard, { backgroundColor: getDemoStatusBg(zone.status) }]}>
              <Text style={[styles.heatmapLevel, { color: getDemoStatusColor(zone.status) }]}>
                {getDemoStatusLabel(zone.status)}
              </Text>
              <Text style={styles.heatmapCount}>{zone.count}명</Text>
              <Text style={styles.heatmapName}>{zone.camera}</Text>
              <Text style={styles.heatmapPlace}>{zone.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.quickButton} onPress={goToStaffTab}>
            <Ionicons name="people-outline" size={23} color={COLORS.primary} />
            <Text style={styles.quickText}>인력 배치</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => navigation.navigate('RiskPrediction')}>
            <Ionicons name="analytics-outline" size={23} color={COLORS.primary} />
            <Text style={styles.quickText}>위험 예측</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton} onPress={() => setNoticeMode(true)}>
            <Ionicons name="megaphone-outline" size={23} color={COLORS.primary} />
            <Text style={styles.quickText}>공지 관리</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>최근 공지</Text>
        {notices.slice(0, 2).map((notice) => (
          <TouchableOpacity key={notice.id} style={styles.noticeCard} onPress={() => editNotice(notice)}>
            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <Text style={styles.noticeContent}>{notice.content}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 22, paddingTop: 64, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  headerCompact: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 22, paddingTop: 62, paddingBottom: 18, backgroundColor: '#FFFFFF' },
  kicker: { color: COLORS.primary, fontSize: 12, fontWeight: '900', marginBottom: 6 },
  title: { color: COLORS.dark, fontSize: 29, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: COLORS.gray, fontSize: 14, fontWeight: '700', marginTop: 8 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F4F6F8', alignItems: 'center', justifyContent: 'center' },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, backgroundColor: '#FFF1F1', paddingHorizontal: 12, paddingVertical: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger },
  liveText: { color: COLORS.danger, fontSize: 12, fontWeight: '900' },
  summaryGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, minHeight: 96, borderRadius: 18, backgroundColor: '#F8FAFB', padding: 18, justifyContent: 'center' },
  summaryLabel: { color: COLORS.gray, fontSize: 13, fontWeight: '800', marginBottom: 8 },
  summaryValue: { color: COLORS.dark, fontSize: 28, fontWeight: '900' },
  predictionCard: { minHeight: 112, borderRadius: 20, backgroundColor: COLORS.primaryLight, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 26 },
  predictionIcon: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center' },
  predictionTitle: { color: COLORS.dark, fontSize: 18, fontWeight: '900', marginBottom: 6 },
  predictionText: { color: '#5F6C80', fontSize: 14, fontWeight: '700' },
  sectionTitle: { color: COLORS.dark, fontSize: 21, fontWeight: '900', marginBottom: 14, marginTop: 8 },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 22 },
  heatmapCard: { width: '48%', minHeight: 134, borderRadius: 18, padding: 16, marginBottom: 12, justifyContent: 'center' },
  heatmapLevel: { fontSize: 18, fontWeight: '900', marginBottom: 8 },
  heatmapCount: { color: COLORS.dark, fontSize: 26, fontWeight: '900', marginBottom: 6 },
  heatmapName: { color: COLORS.gray, fontSize: 12, fontWeight: '900' },
  heatmapPlace: { color: COLORS.dark, fontSize: 15, fontWeight: '900', marginTop: 3 },
  quickGrid: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  quickButton: { flex: 1, minHeight: 72, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', gap: 6 },
  quickText: { color: COLORS.dark, fontSize: 13, fontWeight: '900' },
  writeCard: { borderRadius: 22, backgroundColor: '#F8FAFB', padding: 18, marginBottom: 18 },
  input: { height: 56, borderRadius: 14, backgroundColor: COLORS.white, paddingHorizontal: 16, color: COLORS.dark, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  textarea: { minHeight: 118, borderRadius: 14, backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 14, color: COLORS.dark, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  primaryButton: { height: 54, borderRadius: 14, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '900' },
  noticeCard: { borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white, padding: 18, marginBottom: 12 },
  noticeTitle: { color: COLORS.dark, fontSize: 17, fontWeight: '900', marginBottom: 7 },
  noticeDate: { color: COLORS.gray, fontSize: 12, fontWeight: '700', marginBottom: 10 },
  noticeContent: { color: '#566173', fontSize: 14, lineHeight: 21, fontWeight: '600' },
  rowGap: { flexDirection: 'row', gap: 10, marginTop: 14 },
  secondaryButton: { flex: 1, height: 42, borderRadius: 12, backgroundColor: COLORS.primaryLight, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  secondaryButtonText: { color: COLORS.primary, fontSize: 14, fontWeight: '900' },
  deleteButton: { flex: 1, height: 42, borderRadius: 12, backgroundColor: '#FFF1F1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  deleteButtonText: { color: COLORS.danger, fontSize: 14, fontWeight: '900' },
});
