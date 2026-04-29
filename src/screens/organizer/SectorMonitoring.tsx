import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Polyline, Line, Text as SvgText, Circle } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, getRiskColor, getRiskText } from '../../components/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SECTORS: Record<string, { id: string; name: string; density: number; status: 'safe' | 'normal' | 'caution' | 'critical' }> = {
  'A': { id: 'A', name: 'Sector A', density: 85, status: 'critical' },
  'B': { id: 'B', name: 'Sector B', density: 52, status: 'normal' },
  'C': { id: 'C', name: 'Sector C', density: 72, status: 'caution' },
  'D': { id: 'D', name: 'Sector D', density: 38, status: 'safe' },
  'E': { id: 'E', name: 'Sector E', density: 68, status: 'caution' },
};

const DENSITY_TREND = [45, 52, 58, 65, 72, 79, 85];
const TREND_LABELS = ['30분전', '25분전', '20분전', '15분전', '10분전', '5분전', '현재'];

const CHART_WIDTH = SCREEN_WIDTH - 72;
const CHART_HEIGHT = 120;

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (CHART_WIDTH - 20) + 10;
    const y = CHART_HEIGHT - (v / max) * (CHART_HEIGHT - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  const lastIdx = data.length - 1;
  const lastX = (lastIdx / (data.length - 1)) * (CHART_WIDTH - 20) + 10;
  const lastY = CHART_HEIGHT - (data[lastIdx] / max) * (CHART_HEIGHT - 20) - 10;

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT + 20}>
      {/* Horizontal guide lines */}
      {[25, 50, 75, 100].map(v => {
        const y = CHART_HEIGHT - (v / max) * (CHART_HEIGHT - 20) - 10;
        return (
          <React.Fragment key={v}>
            <Line x1="10" y1={y} x2={CHART_WIDTH - 10} y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" />
            <SvgText x="2" y={y + 4} fontSize="9" fill={Colors.textMuted}>{v}</SvgText>
          </React.Fragment>
        );
      })}
      <Polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={lastX} cy={lastY} r="5" fill={color} />
    </Svg>
  );
}

export default function SectorMonitoring() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const sectorId = route.params?.sectorId || 'A';
  const sector = SECTORS[sectorId] || SECTORS['A'];
  const color = getRiskColor(sector.status);
  const statusText = getRiskText(sector.status);

  const nearbyStaff = [
    { id: 's1', name: '김민수', sector: 'B', distance: '50m' },
    { id: 's2', name: '이지은', sector: 'B', distance: '80m' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{sector.name}</Text>
          <Text style={styles.subtitle}>실시간 구역 상세 모니터링</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 24 }}>
        {/* Status Card */}
        <View style={[styles.statusCard, { borderColor: color, backgroundColor: color + '10' }]}>
          <View style={styles.statusRow}>
            <View style={[styles.statusIcon, { backgroundColor: color }]}>
              <Ionicons name={sector.status === 'safe' ? 'checkmark-circle' : 'warning'} size={28} color="white" />
            </View>
            <View>
              <Text style={styles.statusLabel}>현재 상태</Text>
              <Text style={[styles.statusValue, { color }]}>{statusText}</Text>
            </View>
            <View style={styles.densityBig}>
              <Text style={[styles.densityBigNum, { color }]}>{sector.density}%</Text>
              <Text style={styles.densityBigLabel}>밀집도</Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>밀집도 추이 (최근 30분)</Text>
          <MiniChart data={DENSITY_TREND} color={color} />
          <View style={styles.chartLabels}>
            {TREND_LABELS.filter((_, i) => i % 2 === 0).map((label, i) => (
              <Text key={i} style={styles.chartLabel}>{label}</Text>
            ))}
          </View>
        </View>

        {/* Nearby Staff */}
        {sector.status === 'critical' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>인근 지원 가능 인원</Text>
            <View style={styles.warningBox}>
              <Ionicons name="warning" size={16} color={Colors.danger} />
              <Text style={styles.warningText}>위험 구역입니다. 즉시 추가 인력 배치를 권고합니다.</Text>
            </View>
            {nearbyStaff.map(staff => (
              <View key={staff.id} style={styles.staffCard}>
                <View style={styles.staffAvatar}>
                  <Ionicons name="person" size={18} color={Colors.primary} />
                </View>
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{staff.name}</Text>
                  <Text style={styles.staffMeta}>{staff.sector} · {staff.distance} 거리</Text>
                </View>
                <TouchableOpacity style={styles.deployBtn}>
                  <Text style={styles.deployBtnText}>배치</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* All Sectors Quick Nav */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>다른 구역 보기</Text>
          <View style={styles.sectorNav}>
            {Object.values(SECTORS).map(s => (
              <TouchableOpacity
                key={s.id}
                style={[styles.sectorNavBtn, s.id === sectorId && { borderColor: getRiskColor(s.status) }]}
                onPress={() => navigation.setParams({ sectorId: s.id })}
              >
                <Text style={[styles.sectorNavText, { color: getRiskColor(s.status) }]}>{s.id}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  statusCard: { borderWidth: 2, borderRadius: 20, padding: 20, marginTop: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  statusLabel: { fontSize: 12, color: Colors.textSecondary },
  statusValue: { fontSize: 24, fontWeight: '800' },
  densityBig: { marginLeft: 'auto', alignItems: 'flex-end' },
  densityBigNum: { fontSize: 32, fontWeight: '800' },
  densityBigLabel: { fontSize: 12, color: Colors.textSecondary },
  chartCard: { backgroundColor: Colors.background, borderRadius: 16, padding: 16, marginTop: 16 },
  chartTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  chartLabel: { fontSize: 10, color: Colors.textMuted },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  warningBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.dangerLight, borderRadius: 12, padding: 12, marginBottom: 12 },
  warningText: { flex: 1, fontSize: 13, color: Colors.danger },
  staffCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.background, borderRadius: 14, padding: 14, marginBottom: 8 },
  staffAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  staffInfo: { flex: 1 },
  staffName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  staffMeta: { fontSize: 12, color: Colors.textSecondary },
  deployBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  deployBtnText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  sectorNav: { flexDirection: 'row', gap: 10 },
  sectorNavBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  sectorNavText: { fontSize: 16, fontWeight: '800' },
});
