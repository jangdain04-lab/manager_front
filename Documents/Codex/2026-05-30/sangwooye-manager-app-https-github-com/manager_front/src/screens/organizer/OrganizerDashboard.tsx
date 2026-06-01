import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

const COLORS = {
  primary: '#55CCC4',
  primaryLight: '#EFFFFD',
  dark: '#111827',
  gray: '#9CA3AF',
  danger: '#EF4444',
  warning: '#F59E0B',
  safe: '#16A34A',
};

type RiskLevel = 'safe' | 'warning' | 'danger';

type Place = {
  id: number;
  name: string;
  count: number;
  level: RiskLevel;
};

type Prediction = {
  id: number;
  place: string;
  level: RiskLevel;
  subtitle: string;
};

type Notice = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const registeredPlaces: Place[] = [
  { id: 1, name: '백년관 버정길', count: 53, level: 'danger' },
  { id: 2, name: '자연과학대 앞', count: 28, level: 'safe' },
  { id: 3, name: '공대 흡연부스 옆', count: 35, level: 'warning' },
  { id: 4, name: '인경관 주차장 입구', count: 16, level: 'safe' },
  { id: 5, name: '공대-백년관 사이', count: 44, level: 'danger' },
  { id: 6, name: '백년관 잔디구장', count: 15, level: 'safe' },
];

const riskPrediction: Prediction = {
  id: 1,
  place: '공대 흡연부스 옆',
  level: 'warning',
  subtitle: '잠시 후 주의 예상',
};

const initialNotices: Notice[] = [
  {
    id: 1,
    title: '공대 흡연부스 옆 혼잡 안내',
    content: '현재 공대 흡연부스 옆 구역이 혼잡하니 우회 이동해주세요.',
    createdAt: '2026.04.08 14:20',
  },
  {
    id: 2,
    title: '백년관 버정길 안전 안내',
    content:
      '백년관 버정길 인원이 증가하고 있어 현장 안내요원의 지시에 따라 이동해주세요.',
    createdAt: '2026.04.08 13:45',
  },
];

function getLevelLabel(level: RiskLevel) {
  if (level === 'danger') return '위험';
  if (level === 'warning') return '주의';
  return '여유';
}

function getLevelColor(level: RiskLevel) {
  if (level === 'danger') return COLORS.danger;
  if (level === 'warning') return COLORS.warning;
  return COLORS.safe;
}

function getLevelBackground(level: RiskLevel) {
  if (level === 'danger') return '#FEE2E2';
  if (level === 'warning') return '#FEF3C7';
  return '#DCFCE7';
}

export default function OrganizerDashboard({ navigation }: any) {
  const [noticeMode, setNoticeMode] = useState(false);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);

  const goToStaffTab = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'MainTabs',
        params: {
          screen: 'SectorMonitoringTab',
        },
      }),
    );
  };

  const resetNoticeForm = () => {
    setNoticeTitle('');
    setNoticeContent('');
    setEditingNoticeId(null);
  };

  const handleSaveNotice = () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      Alert.alert('입력 필요', '공지 제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (editingNoticeId) {
      setNotices((prev) =>
        prev.map((notice) =>
          notice.id === editingNoticeId
            ? {
                ...notice,
                title: noticeTitle.trim(),
                content: noticeContent.trim(),
              }
            : notice,
        ),
      );

      Alert.alert('수정 완료', '공지사항이 수정되었습니다.');
    } else {
      const now = new Date();
      const createdAt = `${now.getFullYear()}.${String(
        now.getMonth() + 1,
      ).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(
        now.getHours(),
      ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newNotice: Notice = {
        id: Date.now(),
        title: noticeTitle.trim(),
        content: noticeContent.trim(),
        createdAt,
      };

      setNotices((prev) => [newNotice, ...prev]);
      Alert.alert('등록 완료', '공지사항이 등록되었습니다.');
    }

    resetNoticeForm();
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNoticeId(notice.id);
    setNoticeTitle(notice.title);
    setNoticeContent(notice.content);
  };

  const handleDeleteNotice = (noticeId: number) => {
    Alert.alert('공지 삭제', '해당 공지사항을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          setNotices((prev) => prev.filter((notice) => notice.id !== noticeId));

          if (editingNoticeId === noticeId) {
            resetNoticeForm();
          }
        },
      },
    ]);
  };

  if (noticeMode) {
    return (
      <View style={styles.noticeScreen}>
        <View style={styles.noticeHeader}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.backButton}
            onPress={() => {
              setNoticeMode(false);
              resetNoticeForm();
            }}
          >
            <Ionicons name="arrow-back" size={25} color={COLORS.dark} />
          </TouchableOpacity>

          <View style={styles.noticeHeaderIcon}>
            <Ionicons name="megaphone-outline" size={25} color="#FFFFFF" />
          </View>

          <Text style={styles.noticeHeaderTitle}>공지사항 관리</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.noticeScrollContent}
        >
          <View style={styles.noticeWriteCard}>
            <Text style={styles.noticeSectionTitle}>
              {editingNoticeId ? '공지사항 수정' : '공지사항 작성'}
            </Text>

            <Text style={styles.inputLabel}>제목</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="공지 제목을 입력하세요"
              placeholderTextColor="#AEB6C2"
              value={noticeTitle}
              onChangeText={setNoticeTitle}
            />

            <Text style={styles.inputLabel}>내용</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="참가자에게 전달할 공지 내용을 입력하세요"
              placeholderTextColor="#AEB6C2"
              value={noticeContent}
              onChangeText={setNoticeContent}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.noticeButtonRow}>
              {editingNoticeId && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.cancelEditButton}
                  onPress={resetNoticeForm}
                >
                  <Text style={styles.cancelEditButtonText}>수정 취소</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.saveNoticeButton}
                onPress={handleSaveNotice}
              >
                <Ionicons
                  name={editingNoticeId ? 'checkmark-outline' : 'send-outline'}
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.saveNoticeButtonText}>
                  {editingNoticeId ? '수정 완료' : '공지 등록'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.noticeListHeader}>
            <Text style={styles.noticeSectionTitle}>작성한 공지사항</Text>
            <View style={styles.noticeCountBadge}>
              <Text style={styles.noticeCountText}>{notices.length}개</Text>
            </View>
          </View>

          {notices.length === 0 ? (
            <View style={styles.emptyNoticeBox}>
              <Ionicons name="document-text-outline" size={42} color="#AEB6C2" />
              <Text style={styles.emptyNoticeText}>작성된 공지사항이 없습니다.</Text>
            </View>
          ) : (
            notices.map((notice) => (
              <View key={notice.id} style={styles.noticeCard}>
                <View style={styles.noticeCardTop}>
                  <View style={styles.noticeCardIcon}>
                    <Ionicons
                      name="megaphone-outline"
                      size={22}
                      color={COLORS.primary}
                    />
                  </View>

                  <View style={styles.noticeCardTextBox}>
                    <Text style={styles.noticeCardTitle}>{notice.title}</Text>
                    <Text style={styles.noticeCardDate}>{notice.createdAt}</Text>
                  </View>
                </View>

                <Text style={styles.noticeCardContent}>{notice.content}</Text>

                <View style={styles.noticeActionRow}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.editNoticeButton}
                    onPress={() => handleEditNotice(notice)}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={styles.editNoticeButtonText}>수정</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.deleteNoticeButton}
                    onPress={() => handleDeleteNotice(notice.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={COLORS.danger}
                    />
                    <Text style={styles.deleteNoticeButtonText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={{ height: 90 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={styles.logoDark}>SAFE</Text>
          <Text style={styles.logoMint}>PATH</Text>
        </Text>
        <Text style={styles.subtitle}>실시간 통합 안전관리 시스템</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>실시간 히트맵</Text>

        <TouchableOpacity activeOpacity={0.75} onPress={goToStaffTab}>
          <Text style={styles.detailLink}>상세보기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.heatmapContainer}>
        <View style={styles.heatmapGrid}>
          {registeredPlaces.map((place) => (
            <View
              key={place.id}
              style={[
                styles.heatmapCard,
                { backgroundColor: getLevelBackground(place.level) },
              ]}
            >
              <Text style={[styles.levelText, { color: getLevelColor(place.level) }]}>
                {getLevelLabel(place.level)}
              </Text>
              <Text style={styles.countText}>{place.count}명</Text>
              <Text style={styles.placeName} numberOfLines={2}>
                {place.name}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.safe }]} />
            <Text style={styles.legendText}>여유</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
            <Text style={styles.legendText}>주의</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.danger }]} />
            <Text style={styles.legendText}>위험</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>위험 예측</Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('RiskPrediction')}
        >
          <Text style={styles.detailLink}>상세보기</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('RiskPrediction')}
        style={[
          styles.predictionCard,
          { backgroundColor: getLevelBackground(riskPrediction.level) },
        ]}
      >
        <View style={styles.predictionTop}>
          <View style={styles.predictionTextBox}>
            <Text style={styles.predictionPlace}>{riskPrediction.place}</Text>
            <Text style={styles.predictionSubtitle}>{riskPrediction.subtitle}</Text>
          </View>

          <View
            style={[
              styles.levelBadge,
              { backgroundColor: getLevelColor(riskPrediction.level) },
            ]}
          >
            <Text style={styles.levelBadgeText}>
              {getLevelLabel(riskPrediction.level)}
            </Text>
          </View>
        </View>

        <View style={styles.predictionInfoBox}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color={getLevelColor(riskPrediction.level)}
          />
          <Text
            style={[
              styles.predictionInfoText,
              { color: getLevelColor(riskPrediction.level) },
            ]}
          >
            현재 추세를 기준으로 다음 위험 단계를 예측합니다
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.noticeButton}
        onPress={() => setNoticeMode(true)}
      >
        <Ionicons name="megaphone-outline" size={20} color="#FFFFFF" />
        <Text style={styles.noticeButtonText}>공지사항 작성</Text>
      </TouchableOpacity>

      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 58,
    paddingBottom: 34,
  },

  logoText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 8,
  },

  logoDark: {
    color: COLORS.dark,
  },

  logoMint: {
    color: COLORS.primary,
  },

  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.gray,
  },

  sectionHeader: {
    marginHorizontal: 24,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.dark,
  },

  detailLink: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '800',
  },

  heatmapContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 28,
    padding: 18,
    marginBottom: 34,
  },

  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  heatmapCard: {
    width: '31%',
    minHeight: 128,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  levelText: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },

  countText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.dark,
    marginBottom: 8,
  },

  placeName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },

  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },

  legendText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '700',
  },

  predictionCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,
  },

  predictionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  predictionTextBox: {
    flex: 1,
    marginRight: 14,
  },

  predictionPlace: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.dark,
    marginBottom: 8,
  },

  predictionSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray,
  },

  levelBadge: {
    minWidth: 82,
    height: 58,
    borderRadius: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  levelBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 22,
  },

  predictionInfoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  predictionInfoText: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
    flex: 1,
  },

  noticeButton: {
    marginHorizontal: 24,
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  noticeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 8,
  },

  noticeScreen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  noticeHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  noticeHeaderIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  noticeHeaderTitle: {
    flex: 1,
    fontSize: 25,
    fontWeight: '900',
    color: COLORS.dark,
    letterSpacing: -0.6,
  },

  noticeScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },

  noticeWriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 28,
  },

  noticeSectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.dark,
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.gray,
    marginBottom: 8,
  },

  titleInput: {
    height: 58,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 16,
  },

  contentInput: {
    minHeight: 130,
    borderRadius: 15,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    lineHeight: 22,
    marginBottom: 18,
  },

  noticeButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },

  cancelEditButton: {
    flex: 1,
    height: 54,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelEditButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.dark,
  },

  saveNoticeButton: {
    flex: 1,
    height: 54,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  saveNoticeButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  noticeListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  noticeCountBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 16,
  },

  noticeCountText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
  },

  emptyNoticeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 46,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  emptyNoticeText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray,
  },

  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },

  noticeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  noticeCardIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  noticeCardTextBox: {
    flex: 1,
  },

  noticeCardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.dark,
    marginBottom: 4,
  },

  noticeCardDate: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray,
  },

  noticeCardContent: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 14,
  },

  noticeActionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  editNoticeButton: {
    flex: 1,
    height: 44,
    borderRadius: 13,
    backgroundColor: COLORS.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  editNoticeButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primary,
  },

  deleteNoticeButton: {
    flex: 1,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#FEE2E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  deleteNoticeButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.danger,
  },
});