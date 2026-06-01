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
  DEMO_REFRESH_INTERVAL_MS,
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
    const timer = setInterval(() => setDemoSecond(getDemoSecond()), DEMO_REFRESH_INTERVAL_MS);
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
            <Text style={styles.subtitle}>방문객 앱에 표시할 공지사항을 관리합니다</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.writeCard}>
            <Text style={styles.sectionTitle}>{editingNoticeId ? '공지 수정' : '새 공지 작성'}</Text>
            <Text style={styles.inputLabel}>제목</Text>
            <TextInput
              style={styles.input}
              placeholder="공지 제목"
              placeholderTextColor="#AEB6C2"
              value={noticeTitle}
              onChangeText={setNoticeTitle}
            />
            <Text style={styles.inputLabel}>내용</Text>
            <TextInput
              style={styles.textarea}
              placeholder="공지 내용"
              placeholderTextColor="#AEB6C2"
              value={noticeContent}
              onChangeText={setNoticeContent}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.noticeButtonRow}>
              {!!editingNoticeId && (
                <TouchableOpacity style={styles.cancelEditButton} onPress={resetNoticeForm}>
                  <Text style={styles.cancelEditText}>수정 취소</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.primaryButton} onPress={saveNotice}>
                <Ionicons name={editingNoticeId ? 'checkmark-outline' : 'send-outline'} size={19} color={COLORS.white} />
                <Text style={styles.primaryButtonText}>{editingNoticeId ? '수정 완료' : '공지 등록'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.noticeListHeader}>
            <Text style={styles.sectionTitle}>작성한 공지사항</Text>
            <View style={styles.noticeCountBadge}>
              <Text style={styles.noticeCountText}>{notices.length}개</Text>
            </View>
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
          <Text style={styles.logoText}>
            <Text style={styles.logoDark}>SAFE</Text>
            <Text style={styles.logoMint}>PATH</Text>
          </Text>
          <Text style={styles.subtitle}>실시간 통합 안전관리 시스템</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>실시간 히트맵</Text>
          <TouchableOpacity onPress={goToStaffTab}>
            <Text style={styles.detailLink}>상세보기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heatmapContainer}>
          <View style={styles.heatmapGrid}>
            {zones.map((zone) => (
              <View key={zone.id} style={[styles.heatmapCard, { backgroundColor: getDemoStatusBg(zone.status) }]}>
                <Text style={[styles.heatmapLevel, { color: getDemoStatusColor(zone.status) }]}>
                  {getDemoStatusLabel(zone.status)}
                </Text>
                <Text style={styles.heatmapCount}>{zone.count}명</Text>
                <Text style={styles.heatmapPlace} numberOfLines={2}>{zone.name}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.heatmapSummary}>총 {totalPeople}명 감지 · 위험 구역 {dangerCount}곳</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>위험 예측</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RiskPrediction')}>
            <Text style={styles.detailLink}>상세보기</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.predictionCard} onPress={() => navigation.navigate('RiskPrediction')}>
          <View style={styles.predictionTop}>
            <View style={{ flex: 1 }}>
            <Text style={styles.predictionTitle}>{mostCrowded.name}</Text>
            <Text style={styles.predictionText}>
              현재 {getDemoStatusLabel(mostCrowded.status)} 단계 · 감지 {mostCrowded.count}명
            </Text>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: getDemoStatusColor(mostCrowded.status) }]}>
              <Text style={styles.levelBadgeText}>{getDemoStatusLabel(mostCrowded.status)}</Text>
            </View>
          </View>
          <View style={styles.predictionInfoBox}>
            <Ionicons name="alert-circle-outline" size={20} color={getDemoStatusColor(mostCrowded.status)} />
            <Text style={[styles.predictionInfoText, { color: getDemoStatusColor(mostCrowded.status) }]}>
              현재 추세를 기준으로 다음 위험 단계를 예측합니다
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.noticeManageButton} onPress={() => setNoticeMode(true)}>
          <Ionicons name="megaphone-outline" size={20} color={COLORS.white} />
          <Text style={styles.noticeManageText}>공지사항 작성</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingHorizontal: 24, paddingTop: 58, paddingBottom: 120 },
  header: { marginBottom: 34 },
  headerCompact: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 22, paddingTop: 62, paddingBottom: 18, backgroundColor: '#FFFFFF' },
  logoText: { fontSize: 32, fontWeight: '900', letterSpacing: 0, marginBottom: 8 },
  logoDark: { color: COLORS.dark },
  logoMint: { color: COLORS.primary },
  title: { color: COLORS.dark, fontSize: 29, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: COLORS.gray, fontSize: 14, fontWeight: '700', marginTop: 8 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F4F6F8', alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  detailLink: { color: COLORS.primary, fontSize: 16, fontWeight: '800' },
  heatmapContainer: { backgroundColor: COLORS.white, borderRadius: 24, padding: 16, marginBottom: 28 },
  predictionCard: { borderRadius: 24, backgroundColor: COLORS.primaryLight, padding: 20, marginBottom: 30 },
  predictionTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  predictionTitle: { color: COLORS.dark, fontSize: 22, fontWeight: '900', marginBottom: 8 },
  predictionText: { color: '#5F6C80', fontSize: 15, fontWeight: '700' },
  predictionInfoBox: { backgroundColor: COLORS.white, borderRadius: 16, paddingVertical: 13, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' },
  predictionInfoText: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '800' },
  sectionTitle: { color: COLORS.dark, fontSize: 23, fontWeight: '900', marginBottom: 14, marginTop: 8 },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  heatmapCard: { width: '48%', minHeight: 128, borderRadius: 17, padding: 14, marginBottom: 12, justifyContent: 'center' },
  heatmapLevel: { fontSize: 18, fontWeight: '900', marginBottom: 7 },
  heatmapCount: { color: COLORS.dark, fontSize: 23, fontWeight: '900', marginBottom: 6 },
  heatmapName: { color: COLORS.gray, fontSize: 11, fontWeight: '900' },
  heatmapPlace: { color: COLORS.dark, fontSize: 14, fontWeight: '900', marginTop: 3 },
  heatmapSummary: { color: COLORS.gray, fontSize: 13, fontWeight: '800', textAlign: 'center', marginTop: 4 },
  levelBadge: { minWidth: 76, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, marginLeft: 12 },
  levelBadgeText: { color: COLORS.white, fontSize: 20, fontWeight: '900' },
  noticeManageButton: { height: 54, borderRadius: 16, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 22 },
  noticeManageText: { color: COLORS.white, fontSize: 16, fontWeight: '900' },
  writeCard: { borderRadius: 22, backgroundColor: '#F8FAFB', padding: 18, marginBottom: 18 },
  inputLabel: { color: COLORS.gray, fontSize: 13, fontWeight: '900', marginBottom: 7 },
  input: { height: 56, borderRadius: 14, backgroundColor: COLORS.white, paddingHorizontal: 16, color: COLORS.dark, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  textarea: { minHeight: 118, borderRadius: 14, backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 14, color: COLORS.dark, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  primaryButton: { flex: 1, height: 54, borderRadius: 14, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '900' },
  noticeButtonRow: { flexDirection: 'row', gap: 10 },
  cancelEditButton: { flex: 1, height: 54, borderRadius: 14, backgroundColor: '#EEF1F4', alignItems: 'center', justifyContent: 'center' },
  cancelEditText: { color: COLORS.dark, fontSize: 15, fontWeight: '900' },
  noticeListHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  noticeCountBadge: { borderRadius: 14, backgroundColor: COLORS.primaryLight, paddingHorizontal: 12, paddingVertical: 7, marginBottom: 14 },
  noticeCountText: { color: COLORS.primary, fontSize: 13, fontWeight: '900' },
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
