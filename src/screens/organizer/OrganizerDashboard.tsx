import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { mockSectors } from '../../data/mockData';
import { Colors, getRiskColor, getRiskText } from '../../components/Colors';

const PREDICTED_RISKS = [
  {
    id: '1',
    sector: '공대 흡연부스 옆',
    severity: 'warning',
    timeToRisk: '잠시 후',
    predictedDensity: 78,
  },
  {
    id: '2',
    sector: '공대-백년관 사이',
    severity: 'critical',
    timeToRisk: '4분 후',
    predictedDensity: 88,
  },
];

const HEATMAP_DATA = [
  { id: 'A', label: '여유', count: 16, status: 'safe' },
  { id: 'B', label: '위험', count: 53, status: 'critical' },
  { id: 'C', label: '여유', count: 15, status: 'safe' },
  { id: 'D', label: '위험', count: 44, status: 'critical' },
  { id: 'E', label: '주의', count: 35, status: 'warning' },
  { id: 'F', label: '위험', count: 54, status: 'critical' },
];

export default function OrganizerDashboard() {
  const navigation = useNavigation<any>();
  const fadeAnim = useState(new Animated.Value(0))[0];

  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const overallStatus = mockSectors.some(s => s.status === 'critical')
    ? 'critical'
    : mockSectors.some(s => s.status === 'warning')
      ? 'warning'
      : 'safe';

  const criticalCount = HEATMAP_DATA.filter(s => s.status === 'critical').length;
  const warningCount = HEATMAP_DATA.filter(s => s.status === 'warning').length;

  const canSendNotice = noticeTitle.trim().length > 0 && noticeContent.trim().length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>관리자용</Text>
        <Text style={styles.subtitle}>실시간 이벤트 안전 관리</Text>
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.statusCard,
            {
              opacity: fadeAnim,
              borderColor: getRiskColor(overallStatus),
              backgroundColor:
                overallStatus === 'critical'
                  ? Colors.dangerLight
                  : overallStatus === 'warning'
                    ? Colors.warningLight
                    : Colors.successLight,
            },
          ]}
        >
          <View style={styles.statusTopRow}>
            <View style={[styles.statusIcon, { backgroundColor: getRiskColor(overallStatus) }]}>
              <Ionicons
                name={overallStatus === 'safe' ? 'checkmark-circle-outline' : 'warning-outline'}
                size={30}
                color="white"
              />
            </View>

            <View style={styles.statusTextBlock}>
              <Text style={styles.statusLabel}>현재 상태</Text>
              <Text style={[styles.statusValue, { color: getRiskColor(overallStatus) }]}>
                {getRiskText(overallStatus)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              총 {HEATMAP_DATA.length}개 구역 모니터링 중 · 위험 {criticalCount}개 · 주의 {warningCount}개
            </Text>
          </View>
        </Animated.View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>실시간 히트맵</Text>
          <TouchableOpacity onPress={() => navigation.navigate('InteractiveMap')}>
            <Text style={styles.detailLink}>상세보기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heatmapCard}>
          <View style={styles.heatmapGrid}>
            {HEATMAP_DATA.map(item => {
              const color = getRiskColor(item.status);

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={[
                    styles.heatmapItem,
                    {
                      backgroundColor:
                        item.status === 'critical'
                          ? '#F3D3D3'
                          : item.status === 'warning'
                            ? '#F7EBD2'
                            : '#D9EBDC',
                    },
                  ]}
                  onPress={() => navigation.navigate('SectorMonitoring', { showAllGraphs: true })}
                >
                  <Text style={[styles.heatmapLabel, { color }]}>{item.label}</Text>
                  <Text style={styles.heatmapCount}>{item.count}명</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.legendDivider} />

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: getRiskColor('safe') }]} />
              <Text style={styles.legendText}>여유</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: getRiskColor('warning') }]} />
              <Text style={styles.legendText}>주의</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: getRiskColor('critical') }]} />
              <Text style={styles.legendText}>위험</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>위험 예측</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SectorMonitoring')}>
            <Text style={styles.detailLink}>상세보기</Text>
          </TouchableOpacity>
        </View>

        {PREDICTED_RISKS.map(risk => {
          const color = getRiskColor(risk.severity);

          return (
            <TouchableOpacity
              key={risk.id}
              activeOpacity={0.85}
              style={[
                styles.predictionCard,
                {
                  backgroundColor:
                    risk.severity === 'critical' ? '#FFF1F1' : '#FFF9E8',
                  borderColor:
                    risk.severity === 'critical' ? '#F5D1D1' : '#F3E2AE',
                },
              ]}
              onPress={() => navigation.navigate('SectorMonitoring')}
            >
              <View style={styles.predictionTop}>
                <View style={styles.predictionTitleRow}>
                  <Ionicons name="trending-up" size={17} color={color} />
                  <Text style={styles.predictionTitle}>{risk.sector}</Text>
                </View>

                <View style={[styles.percentBadge, { backgroundColor: color }]}>
                  <Text style={styles.percentBadgeText}>{risk.predictedDensity}%</Text>
                </View>
              </View>

              <Text style={styles.predictionSubText}>
                {risk.timeToRisk}{' '}
                <Text style={{ color, fontWeight: '800' }}>{getRiskText(risk.severity)}</Text> 예상
              </Text>

              <View style={styles.predictionBar}>
                <View
                  style={[
                    styles.predictionFill,
                    {
                      width: `${risk.predictedDensity}%` as any,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.noticeTitleRow}>
          <Ionicons name="megaphone-outline" size={21} color="#5B73F2" />
          <Text style={styles.sectionTitle}>행사 공지사항 작성</Text>
        </View>

        <View style={styles.noticeCard}>
          <Text style={styles.inputLabel}>공지사항 제목</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="공지사항 제목을 입력하세요..."
            placeholderTextColor={Colors.textSecondary}
            value={noticeTitle}
            onChangeText={setNoticeTitle}
          />

          <Text style={styles.inputLabel}>공지사항 내용</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="참가자들에게 전달할 공지사항을 입력하세요..."
            placeholderTextColor={Colors.textSecondary}
            value={noticeContent}
            onChangeText={setNoticeContent}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.noticeHint}>
            작성한 공지사항은 모든 참가자에게 푸시 알림으로 전송됩니다.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!canSendNotice}
            style={[
              styles.sendButton,
              canSendNotice ? styles.sendButtonActive : styles.sendButtonDisabled,
            ]}
            onPress={() => navigation.navigate('EmergencyControl')}
          >
            <Ionicons
              name="paper-plane-outline"
              size={19}
              color={canSendNotice ? Colors.white : Colors.textSecondary}
            />
            <Text
              style={[
                styles.sendButtonText,
                { color: canSendNotice ? Colors.white : Colors.textSecondary },
              ]}
            >
              공지사항 전송하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: 104,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 28,
    paddingTop: 76,
    paddingBottom: 34,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: -0.7,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },

  statusCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
  },
  statusTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 14,
  },
  statusIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTextBlock: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 1,
    fontWeight: '700',
  },
  statusValue: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  summaryBox: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  summaryText: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.35,
  },
  detailLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5865F2',
  },

  heatmapCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.045,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 9,
  },
  heatmapItem: {
    width: '31%',
    height: 78,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatmapLabel: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  heatmapCount: {
    fontSize: 12.5,
    color: Colors.text,
    fontWeight: '700',
  },
  legendDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: 15,
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '700',
  },

  predictionCard: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 14,
    marginBottom: 11,
  },
  predictionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
    paddingRight: 8,
  },
  predictionTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.2,
  },
  percentBadge: {
    minWidth: 54,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
  },
  percentBadgeText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
  predictionSubText: {
    marginTop: 4,
    fontSize: 12.5,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  predictionBar: {
    marginTop: 11,
    height: 6,
    backgroundColor: Colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  predictionFill: {
    height: '100%',
    borderRadius: 4,
  },

  noticeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 10,
  },
  noticeCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  titleInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  contentInput: {
    height: 112,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 13,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  noticeHint: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 16,
  },
  sendButton: {
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendButtonActive: {
    backgroundColor: '#5B73F2',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.background,
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: '900',
  },
});