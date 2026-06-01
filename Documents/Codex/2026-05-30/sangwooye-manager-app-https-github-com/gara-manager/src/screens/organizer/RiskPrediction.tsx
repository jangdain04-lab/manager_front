import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Line, Polyline, Text as SvgText } from 'react-native-svg';
import {
  DEMO_DENSITY_ROWS,
  DEMO_REFRESH_INTERVAL_MS,
  DemoStatus,
  getDemoSecond,
  getDemoStatus,
  getDemoStatusColor,
  getDemoStatusLabel,
  getDemoZones,
} from '../../data/demoData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const THEME = { primary: '#55CCC4', dark: '#111827', muted: '#8B95A1', white: '#FFFFFF', border: '#EEF1F4' };
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 210;

type Prediction = {
  id: string;
  name: string;
  camera: string;
  status: DemoStatus;
  progress: number;
  values: number[];
};

function getStatusBg(status: DemoStatus) {
  if (status === 'danger') return '#FFF1F1';
  if (status === 'warning') return '#FFF8E8';
  return '#ECFDF3';
}

function getStatusBorder(status: DemoStatus) {
  if (status === 'danger') return '#F6CACA';
  if (status === 'warning') return '#F6E2A9';
  return '#BFEFD1';
}

function PredictionChart({ color, values }: { color: string; values: number[] }) {
  const leftPad = 32;
  const rightPad = 14;
  const topPad = 20;
  const bottomPad = 30;
  const graphWidth = CHART_WIDTH - leftPad - rightPad;
  const graphHeight = CHART_HEIGHT - topPad - bottomPad;
  const currentIndex = 5;
  const getX = (index: number) => leftPad + (index / (values.length - 1)) * graphWidth;
  const getY = (value: number) => topPad + graphHeight - (value / 18) * graphHeight;
  const pastPoints = values.slice(0, currentIndex + 1).map((value, index) => `${getX(index)},${getY(value)}`).join(' ');
  const futurePoints = values.slice(currentIndex).map((value, index) => `${getX(index + currentIndex)},${getY(value)}`).join(' ');

  return (
    <View style={styles.chartWrap}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {[0, 6, 12, 18].map((value) => {
          const y = getY(value);
          return (
            <React.Fragment key={value}>
              <Line x1={leftPad} y1={y} x2={CHART_WIDTH - rightPad} y2={y} stroke="#E4E7EB" strokeWidth="1" strokeDasharray="4 4" />
              <SvgText x={leftPad - 9} y={y + 4} fontSize="10" fill="#8B95A1" textAnchor="end">{value}</SvgText>
            </React.Fragment>
          );
        })}
        <Line x1={getX(currentIndex)} y1={topPad} x2={getX(currentIndex)} y2={CHART_HEIGHT - bottomPad} stroke="#8B95A1" strokeWidth="2" strokeDasharray="6 6" />
        <SvgText x={getX(currentIndex)} y={topPad - 5} fontSize="9" fill="#8B95A1" textAnchor="middle">현재</SvgText>
        <Polyline points={pastPoints} fill="none" stroke={THEME.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <Polyline points={futurePoints} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 6" />
        {[
          ['-5초', 0],
          ['현재', 5],
          ['+4초', 9],
        ].map(([label, index]) => (
          <SvgText key={label} x={getX(Number(index))} y={CHART_HEIGHT - 9} fontSize="10" fill="#8B95A1" textAnchor="middle">{label}</SvgText>
        ))}
      </Svg>
      <View style={styles.legendDivider} />
      <View style={styles.chartLegendRow}>
        <View style={styles.chartLegendItem}><View style={[styles.legendLine, { backgroundColor: THEME.primary }]} /><Text style={styles.chartLegendText}>감지 데이터</Text></View>
        <View style={styles.chartLegendItem}><View style={[styles.legendDashed, { borderColor: color }]} /><Text style={styles.chartLegendText}>예측 데이터</Text></View>
      </View>
    </View>
  );
}

export default function RiskPrediction({ navigation }: any) {
  const [demoSecond, setDemoSecond] = useState(getDemoSecond());
  const [expandedId, setExpandedId] = useState<string | null>('cam1');

  useEffect(() => {
    const timer = setInterval(() => setDemoSecond(getDemoSecond()), DEMO_REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const predictions = useMemo<Prediction[]>(() => {
    const zones = getDemoZones(demoSecond);
    return zones.map((zone, cameraIndex) => {
      const values = Array.from({ length: 10 }, (_, index) => {
        const rowIndex = (demoSecond - 5 + index + DEMO_DENSITY_ROWS.length) % DEMO_DENSITY_ROWS.length;
        return DEMO_DENSITY_ROWS[rowIndex][cameraIndex + 1];
      });
      const predictedValue = values[values.length - 1];
      return {
        id: zone.id,
        name: zone.name,
        camera: zone.camera,
        status: getDemoStatus(predictedValue),
        progress: Math.round((predictedValue / 18) * 100),
        values,
      };
    });
  }, [demoSecond]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={THEME.dark} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>위험 예측</Text>
          <Text style={styles.subtitle}>구역별 인구 밀도 추세 예측</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>위험 예측 그래프</Text>
        {predictions.map((item) => {
          const color = getDemoStatusColor(item.status);
          const expanded = expandedId === item.id;
          return (
            <View key={item.id} style={[styles.card, { backgroundColor: getStatusBg(item.status), borderColor: getStatusBorder(item.status) }]}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => setExpandedId(expanded ? null : item.id)}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    <Ionicons name="trending-up" size={20} color={color} />
                    <View>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSub}>{item.camera} · 4초 후 {getDemoStatusLabel(item.status)} 예상</Text>
                    </View>
                  </View>
                  <View style={[styles.badge, { backgroundColor: color }]}><Text style={styles.badgeText}>{item.progress}%</Text></View>
                </View>
                <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: color }]} /></View>
              </TouchableOpacity>
              {expanded && <PredictionChart color={color} values={item.values} />}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: THEME.white },
  scrollContent: { paddingBottom: 110 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 28, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: THEME.border },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  title: { color: THEME.dark, fontSize: 28, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { color: THEME.muted, fontSize: 14, fontWeight: '600', marginTop: 6 },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { color: THEME.dark, fontSize: 22, fontWeight: '900', marginBottom: 16 },
  card: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 8 },
  cardTitle: { color: THEME.dark, fontSize: 16, fontWeight: '900', marginBottom: 4 },
  cardSub: { color: THEME.muted, fontSize: 13, fontWeight: '700' },
  badge: { minWidth: 58, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  badgeText: { color: THEME.white, fontSize: 16, fontWeight: '900' },
  progressTrack: { marginTop: 14, height: 8, borderRadius: 999, backgroundColor: THEME.white, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  chartWrap: { marginTop: 16, backgroundColor: THEME.white, borderRadius: 16, paddingTop: 12, alignItems: 'center' },
  legendDivider: { height: 1, width: '100%', backgroundColor: THEME.border, marginTop: 6, marginBottom: 12 },
  chartLegendRow: { flexDirection: 'row', justifyContent: 'center', gap: 22, paddingBottom: 14 },
  chartLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendLine: { width: 22, height: 3, borderRadius: 999 },
  legendDashed: { width: 22, height: 0, borderTopWidth: 3, borderStyle: 'dashed' },
  chartLegendText: { color: THEME.muted, fontSize: 12, fontWeight: '700' },
});
