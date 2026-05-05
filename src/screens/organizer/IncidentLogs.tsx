import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../components/Colors';

interface IncidentLog {
  id: string;
  time: string;
  date: string;
  sector: string;
  gate: string;
  level: 'critical';
  density: number;
  duration: string;
  description: string;
  image: string;
}

const INCIDENTS: IncidentLog[] = [
  {
    id: '1',
    time: '14:32',
    date: '2026.04.08',
    sector: 'Sector A',
    gate: 'Gate 1',
    level: 'critical',
    density: 458,
    duration: '8분 37초',
    description: '급격한 인원 증가로 인한 위험 상황',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '2',
    time: '12:45',
    date: '2026.04.08',
    sector: 'Sector A',
    gate: 'Gate 1',
    level: 'critical',
    density: 390,
    duration: '5분 22초',
    description: '출입구 병목 현상',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '3',
    time: '22:15',
    date: '2026.04.07',
    sector: 'Sector B',
    gate: 'Gate 2',
    level: 'critical',
    density: 476,
    duration: '11분 08초',
    description: '퇴장 시 급격한 밀집',
    image:
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function IncidentLogs() {
  const [search, setSearch] = useState('');

  const filtered = INCIDENTS.filter(inc => {
    return (
      !search ||
      inc.sector.toLowerCase().includes(search.toLowerCase()) ||
      inc.gate.toLowerCase().includes(search.toLowerCase()) ||
      inc.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  const grouped = filtered.reduce<Record<string, IncidentLog[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const groupedDates = Object.keys(grouped);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>사건 기록</Text>
            <View style={styles.badgeMini}>
              <Text style={styles.badgeMiniText}>위험 {INCIDENTS.length}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>자동 녹화 영상 및 로그</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="게이트 또는 구역 검색..."
              placeholderTextColor={Colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {groupedDates.map((date, dateIndex) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateLabel}>{date}</Text>

              {grouped[date].map((inc, index) => {
                const isLast =
                  dateIndex === groupedDates.length - 1 &&
                  index === grouped[date].length - 1;

                return (
                  <View key={inc.id} style={styles.timelineRow}>
                    <View style={styles.timelineRail}>
                      <View style={styles.timelineDotOuter}>
                        <View style={styles.timelineDotInner} />
                      </View>
                      {!isLast && <View style={styles.timelineLine} />}
                    </View>

                    <View style={styles.incidentCard}>
                      <View style={styles.cardHeader}>
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>위험</Text>
                        </View>

                        <View style={styles.timeRow}>
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color={Colors.textSecondary}
                          />
                          <Text style={styles.timeText}>
                            {inc.date} {inc.time}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.cardTitle}>
                        {inc.gate} · {inc.sector}
                      </Text>

                      <Text style={styles.description}>{inc.description}</Text>

                      <View style={styles.imageWrap}>
                        <Image source={{ uri: inc.image }} style={styles.image} />
                        <View style={styles.durationBadge}>
                          <Text style={styles.durationText}>{inc.duration}</Text>
                        </View>
                      </View>

                      <View style={styles.densityBox}>
                        <View>
                          <Text style={styles.densityLabel}>최고 밀집도</Text>
                          <View style={styles.densityBarBg}>
                            <View
                              style={[
                                styles.densityBarFill,
                                {
                                  width: `${Math.min(100, Math.round(inc.density / 5))}%` as any,
                                },
                              ]}
                            />
                          </View>
                        </View>

                        <Text style={styles.densityValue}>{inc.density}명</Text>
                      </View>

                      <TouchableOpacity activeOpacity={0.85} style={styles.videoButton}>
                        <Ionicons name="videocam-outline" size={18} color={Colors.white} />
                        <Text style={styles.videoButtonText}>녹화 영상 보기</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}

          {filtered.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={38} color={Colors.textMuted} />
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const DANGER = '#D0453B';
const DANGER_LIGHT = '#FFF3F3';
const PRIMARY = '#5B73F2';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: 108,
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: 76,
    paddingBottom: 28,
    backgroundColor: Colors.white,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.8,
  },
  badgeMini: {
    backgroundColor: '#FDECEC',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 2,
  },
  badgeMiniText: {
    color: DANGER,
    fontSize: 12,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },

  searchBox: {
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },

  dateGroup: {
    marginTop: 2,
  },
  dateLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '900',
    marginBottom: 10,
  },

  timelineRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 20,
  },
  timelineRail: {
    width: 28,
    alignItems: 'center',
  },
  timelineDotOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DANGER,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    zIndex: 2,
  },
  timelineDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: DANGER,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: 4,
  },

  incidentCard: {
    flex: 1,
    backgroundColor: DANGER_LIGHT,
    borderWidth: 1,
    borderColor: '#F3CFCF',
    borderRadius: 18,
    padding: 14,
    shadowColor: DANGER,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: DANGER,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  timeRow: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '900',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: 12,
    lineHeight: 19,
  },

  imageWrap: {
    height: 142,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: Colors.background,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    right: 10,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800',
  },

  densityBox: {
    backgroundColor: Colors.white,
    borderRadius: 13,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  densityLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '800',
    marginBottom: 8,
  },
  densityBarBg: {
    width: 190,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  densityBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: DANGER,
  },
  densityValue: {
    fontSize: 19,
    color: DANGER,
    fontWeight: '900',
  },

  videoButton: {
    height: 48,
    borderRadius: 13,
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: PRIMARY,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  videoButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '900',
  },

  empty: {
    alignItems: 'center',
    paddingTop: 70,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
});