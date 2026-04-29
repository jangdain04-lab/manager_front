import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, getRiskColor } from '../../components/Colors';

interface IncidentLog {
  id: string;
  time: string;
  date: string;
  sector: string;
  gate: string;
  level: 'warning' | 'critical';
  density: number;
  duration: string;
  description: string;
}

const INCIDENTS: IncidentLog[] = [
  { id: '1', time: '14:32', date: '2026.04.08', sector: 'Sector A', gate: 'Gate 1', level: 'critical', density: 92, duration: '8분 37초', description: '급격한 인원 증가로 인한 위험 상황' },
  { id: '2', time: '13:18', date: '2026.04.08', sector: 'Sector C', gate: 'Gate 3', level: 'warning', density: 75, duration: '12분 15초', description: '주의 단계 진입' },
  { id: '3', time: '12:45', date: '2026.04.08', sector: 'Sector A', gate: 'Gate 1', level: 'critical', density: 88, duration: '5분 22초', description: '출입구 병목 현상' },
  { id: '4', time: '11:22', date: '2026.04.08', sector: 'Sector E', gate: 'Gate 5', level: 'warning', density: 68, duration: '15분 43초', description: '이벤트 시작 전 대기 인원 증가' },
  { id: '5', time: '22:15', date: '2026.04.07', sector: 'Sector B', gate: 'Gate 2', level: 'critical', density: 94, duration: '11분 08초', description: '퇴장 시 급격한 밀집' },
  { id: '6', time: '18:50', date: '2026.04.07', sector: 'Sector D', gate: 'Gate 4', level: 'warning', density: 71, duration: '9분 31초', description: '간식 코너 부근 혼잡' },
];

export default function IncidentLogs() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'warning' | 'critical'>('all');

  const filtered = INCIDENTS.filter(inc => {
    const matchSearch = !search || inc.sector.includes(search) || inc.description.includes(search) || inc.gate.includes(search);
    const matchLevel = filterLevel === 'all' || inc.level === filterLevel;
    return matchSearch && matchLevel;
  });

  const groupByDate = (items: IncidentLog[]) => {
    const groups: Record<string, IncidentLog[]> = {};
    items.forEach(item => {
      if (!groups[item.date]) groups[item.date] = [];
      groups[item.date].push(item);
    });
    return groups;
  };

  const grouped = groupByDate(filtered);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>사고 기록</Text>
          <Text style={styles.subtitle}>혼잡 이벤트 로그</Text>
        </View>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="구역, 설명 검색..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'warning', 'critical'] as const).map(level => (
          <TouchableOpacity
            key={level}
            style={[styles.filterBtn, filterLevel === level && styles.filterBtnActive]}
            onPress={() => setFilterLevel(level)}
          >
            <Text style={[styles.filterText, filterLevel === level && styles.filterTextActive]}>
              {level === 'all' ? '전체' : level === 'warning' ? '주의' : '위험'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 24 }}>
        {Object.entries(grouped).map(([date, items]) => (
          <View key={date}>
            <Text style={styles.dateLabel}>{date}</Text>
            {items.map(inc => (
              <View key={inc.id} style={[
                styles.incidentCard,
                { borderLeftColor: getRiskColor(inc.level) }
              ]}>
                <View style={styles.incidentHeader}>
                  <View style={[styles.levelBadge, { backgroundColor: getRiskColor(inc.level) }]}>
                    <Text style={styles.levelText}>{inc.level === 'critical' ? '위험' : '주의'}</Text>
                  </View>
                  <Text style={styles.incidentTime}>{inc.time}</Text>
                </View>
                <Text style={styles.incidentDesc}>{inc.description}</Text>
                <View style={styles.incidentMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location" size={12} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{inc.sector} · {inc.gate}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time" size={12} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{inc.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="people" size={12} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{inc.density}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          </View>
        )}
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
  searchRow: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.background, borderRadius: 12, paddingHorizontal: 14, height: 42 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 24, marginBottom: 16 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.background },
  filterBtnActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  dateLabel: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, marginTop: 8 },
  incidentCard: { backgroundColor: Colors.background, borderRadius: 14, padding: 14, marginBottom: 10, borderLeftWidth: 4 },
  incidentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  levelBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  levelText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  incidentTime: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600', marginLeft: 'auto' },
  incidentDesc: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  incidentMeta: { flexDirection: 'row', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
});
