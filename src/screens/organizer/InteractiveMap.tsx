import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Text as SvgText, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { Colors, getRiskColor } from '../../components/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_WIDTH = SCREEN_WIDTH - 48;
const MAP_HEIGHT = 300;
const SCALE_X = MAP_WIDTH / 500;
const SCALE_Y = MAP_HEIGHT / 450;

interface SectorData {
  id: string;
  name: string;
  label: string;
  x: number; y: number; w: number; h: number;
  density: number;
  level: 'safe' | 'warning' | 'critical';
  staffCount: number;
}

interface StaffMember {
  id: string; name: string; sector: string; x: number; y: number;
}

const SECTORS: SectorData[] = [
  { id: 'a', name: 'Sector A', label: 'A', x: 20, y: 80, w: 140, h: 160, density: 88, level: 'critical', staffCount: 2 },
  { id: 'b', name: 'Sector B', label: 'B', x: 180, y: 80, w: 140, h: 160, density: 45, level: 'safe', staffCount: 4 },
  { id: 'c', name: 'Sector C', label: 'C', x: 340, y: 80, w: 140, h: 160, density: 72, level: 'warning', staffCount: 3 },
  { id: 'd', name: 'Sector D', label: 'D', x: 20, y: 260, w: 220, h: 160, density: 38, level: 'safe', staffCount: 3 },
  { id: 'e', name: 'Sector E', label: 'E', x: 260, y: 260, w: 220, h: 160, density: 62, level: 'warning', staffCount: 2 },
];

const STAFF: StaffMember[] = [
  { id: 's1', name: '김철수', sector: 'a', x: 60, y: 140 },
  { id: 's2', name: '이영희', sector: 'a', x: 110, y: 180 },
  { id: 's3', name: '박민수', sector: 'b', x: 220, y: 120 },
  { id: 's4', name: '정수진', sector: 'b', x: 270, y: 160 },
  { id: 's5', name: '최동욱', sector: 'b', x: 230, y: 200 },
  { id: 's6', name: '한지민', sector: 'b', x: 285, y: 130 },
  { id: 's7', name: '강태양', sector: 'c', x: 380, y: 140 },
  { id: 's8', name: '송미래', sector: 'c', x: 430, y: 180 },
  { id: 's9', name: '윤서준', sector: 'c', x: 395, y: 210 },
  { id: 's10', name: '임하늘', sector: 'd', x: 100, y: 320 },
  { id: 's11', name: '오바다', sector: 'd', x: 160, y: 360 },
  { id: 's12', name: '신별이', sector: 'd', x: 130, y: 380 },
  { id: 's13', name: '남구름', sector: 'e', x: 320, y: 310 },
  { id: 's14', name: '홍달님', sector: 'e', x: 410, y: 350 },
];

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

export default function InteractiveMap() {
  const navigation = useNavigation();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const selected = SECTORS.find(s => s.id === selectedSector);
  const staffInSector = selectedSector ? STAFF.filter(s => s.sector === selectedSector) : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>인력 배치 현황</Text>
          <Text style={styles.subtitle}>실시간 구역별 스태프 위치</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{STAFF.length}</Text>
            <Text style={styles.statLabel}>전체 인원</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.danger }]}>
              {SECTORS.filter(s => s.level === 'critical').length}
            </Text>
            <Text style={styles.statLabel}>위험 구역</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.warning }]}>
              {SECTORS.filter(s => s.level === 'warning').length}
            </Text>
            <Text style={styles.statLabel}>주의 구역</Text>
          </View>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <Text style={styles.mapTitle}>구역 배치도</Text>
          <Text style={styles.mapSubtitle}>구역을 탭하면 상세 정보를 확인할 수 있습니다</Text>
          <View style={styles.mapWrapper}>
            <Svg width={MAP_WIDTH} height={MAP_HEIGHT} viewBox="0 0 500 450">
              {/* Background */}
              <Rect x="0" y="0" width="500" height="450" fill="#F8F9FA" rx="12" />

              {/* Sectors */}
              {SECTORS.map(s => {
                const color = getRiskColor(s.level);
                const isSelected = selectedSector === s.id;
                return (
                  <React.Fragment key={s.id}>
                    <Rect
                      x={s.x} y={s.y} width={s.w} height={s.h}
                      fill={hexToRgba(color, 0.15)}
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 1.5}
                      rx="8"
                      onPress={() => setSelectedSector(isSelected ? null : s.id)}
                    />
                    <SvgText
                      x={s.x + s.w / 2} y={s.y + 30}
                      fill={color} fontSize="22" fontWeight="800"
                      textAnchor="middle"
                    >
                      {s.label}
                    </SvgText>
                    <SvgText
                      x={s.x + s.w / 2} y={s.y + 50}
                      fill={color} fontSize="11"
                      textAnchor="middle"
                    >
                      {s.density}%
                    </SvgText>
                  </React.Fragment>
                );
              })}

              {/* Staff dots */}
              {STAFF.map(member => {
                const sector = SECTORS.find(s => s.id === member.sector);
                const color = sector ? getRiskColor(sector.level) : Colors.primary;
                return (
                  <Circle
                    key={member.id}
                    cx={member.x} cy={member.y}
                    r="8" fill={color} opacity={0.9}
                  />
                );
              })}
            </Svg>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            {[['critical', '위험'], ['warning', '주의'], ['safe', '안전']].map(([level, label]) => (
              <View key={level} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: getRiskColor(level) }]} />
                <Text style={styles.legendText}>{label}</Text>
              </View>
            ))}
            <View style={styles.legendItem}>
              <Circle />
              <Ionicons name="person" size={12} color={Colors.primary} />
              <Text style={styles.legendText}>스태프</Text>
            </View>
          </View>
        </View>

        {/* Selected Sector Detail */}
        {selected && (
          <View style={[styles.detailCard, { borderColor: getRiskColor(selected.level) }]}>
            <View style={styles.detailHeader}>
              <Text style={[styles.detailTitle, { color: getRiskColor(selected.level) }]}>
                {selected.name}
              </Text>
              <TouchableOpacity onPress={() => setSelectedSector(null)}>
                <Ionicons name="close-circle" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.detailStats}>
              <View style={styles.detailStat}>
                <Text style={styles.detailStatValue}>{selected.density}%</Text>
                <Text style={styles.detailStatLabel}>밀집도</Text>
              </View>
              <View style={styles.detailStat}>
                <Text style={styles.detailStatValue}>{selected.staffCount}명</Text>
                <Text style={styles.detailStatLabel}>배치 인원</Text>
              </View>
            </View>
            {selected.level === 'critical' && (
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={16} color={Colors.danger} />
                <Text style={styles.warningText}>위험 구역입니다. 즉시 추가 인력 배치를 권고합니다.</Text>
              </View>
            )}
            <Text style={styles.staffListTitle}>배치 스태프</Text>
            {staffInSector.map(staff => (
              <View key={staff.id} style={styles.staffItem}>
                <View style={[styles.staffIcon, { backgroundColor: getRiskColor(selected.level) + '22' }]}>
                  <Ionicons name="person" size={14} color={getRiskColor(selected.level)} />
                </View>
                <Text style={styles.staffName}>{staff.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Sector List */}
        <View style={styles.sectorList}>
          <Text style={styles.sectionTitle}>구역별 현황</Text>
          {SECTORS.map(s => (
            <TouchableOpacity
              key={s.id}
              style={[styles.sectorItem, selectedSector === s.id && { borderColor: getRiskColor(s.level) }]}
              onPress={() => setSelectedSector(selectedSector === s.id ? null : s.id)}
            >
              <View style={[styles.sectorBadge, { backgroundColor: getRiskColor(s.level) }]}>
                <Text style={styles.sectorBadgeText}>{s.label}</Text>
              </View>
              <View style={styles.sectorInfo}>
                <Text style={styles.sectorName}>{s.name}</Text>
                <Text style={styles.sectorMeta}>{s.staffCount}명 배치 · 밀집도 {s.density}%</Text>
              </View>
              <View style={[styles.levelPill, { backgroundColor: getRiskColor(s.level) + '22' }]}>
                <Text style={[styles.levelPillText, { color: getRiskColor(s.level) }]}>
                  {s.level === 'critical' ? '위험' : s.level === 'warning' ? '주의' : '안전'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  mapContainer: { paddingHorizontal: 24, paddingTop: 20 },
  mapTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  mapSubtitle: { fontSize: 12, color: Colors.textSecondary, marginBottom: 12 },
  mapWrapper: { borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.background },
  legend: { flexDirection: 'row', gap: 16, marginTop: 12, marginBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: Colors.textSecondary },
  detailCard: { marginHorizontal: 24, marginTop: 16, borderRadius: 16, padding: 16, borderWidth: 2, backgroundColor: Colors.background },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  detailTitle: { fontSize: 18, fontWeight: '800' },
  detailStats: { flexDirection: 'row', gap: 20, marginBottom: 12 },
  detailStat: { alignItems: 'center' },
  detailStatValue: { fontSize: 20, fontWeight: '800', color: Colors.text },
  detailStatLabel: { fontSize: 12, color: Colors.textSecondary },
  warningBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.dangerLight, borderRadius: 10, padding: 10, marginBottom: 12 },
  warningText: { flex: 1, fontSize: 13, color: Colors.danger },
  staffListTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  staffItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  staffIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  staffName: { fontSize: 14, color: Colors.text },
  sectorList: { paddingHorizontal: 24, paddingTop: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  sectorItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.background, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1.5, borderColor: 'transparent' },
  sectorBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  sectorBadgeText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  sectorInfo: { flex: 1 },
  sectorName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  sectorMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  levelPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  levelPillText: { fontSize: 12, fontWeight: '700' },
});
