import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getDemoSecond,
  getDemoStatusBg,
  getDemoStatusColor,
  getDemoStatusLabel,
  getDemoZones,
} from '../../data/demoData';

const THEME = {
  primary: '#55CCC4',
  dark: '#111827',
  muted: '#8B95A1',
  white: '#FFFFFF',
  border: '#EEF1F4',
};

export default function RiskPrediction({ navigation }: any) {
  const [demoSecond, setDemoSecond] = useState(getDemoSecond());
  const [expandedId, setExpandedId] = useState<string | null>('cam1');

  useEffect(() => {
    const timer = setInterval(() => setDemoSecond(getDemoSecond()), 1000);
    return () => clearInterval(timer);
  }, []);

  const zones = useMemo(() => getDemoZones(demoSecond), [demoSecond]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={THEME.dark} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>위험 예측</Text>
          <Text style={styles.subtitle}>4개 cam의 다음 구간 혼잡도를 데모로 표시합니다</Text>
        </View>
      </View>

      {zones.map((zone, index) => {
        const predicted = Math.min(100, zone.density + [12, 7, -4, 10][index]);
        const selected = expandedId === zone.id;

        return (
          <TouchableOpacity
            key={zone.id}
            activeOpacity={0.88}
            style={[styles.card, { backgroundColor: getDemoStatusBg(zone.status), borderColor: getDemoStatusColor(zone.status) }]}
            onPress={() => setExpandedId(selected ? null : zone.id)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <Ionicons name={predicted >= zone.density ? 'trending-up' : 'trending-down'} size={22} color={getDemoStatusColor(zone.status)} />
                <View>
                  <Text style={styles.cardTitle}>{zone.name}</Text>
                  <Text style={styles.cardSub}>{zone.camera} · 현재 {getDemoStatusLabel(zone.status)}</Text>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: getDemoStatusColor(zone.status) }]}>
                <Text style={styles.badgeText}>{predicted}%</Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressCurrent, { width: `${zone.density}%` }]} />
              <View style={[styles.progressFuture, { width: `${predicted}%`, backgroundColor: getDemoStatusColor(zone.status) }]} />
            </View>

            {selected && (
              <View style={styles.detailBox}>
                <Text style={styles.detailTitle}>예측 설명</Text>
                <Text style={styles.detailText}>
                  현재 감지 인원은 {zone.count}명입니다. 시연 데이터 흐름상 다음 구간에서
                  {' '}{predicted >= zone.density ? '혼잡도가 상승할 가능성' : '혼잡도가 완화될 가능성'}이 있습니다.
                </Text>
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}><View style={styles.currentDot} /><Text style={styles.legendText}>현재</Text></View>
                  <View style={styles.legendItem}><View style={[styles.futureDot, { backgroundColor: getDemoStatusColor(zone.status) }]} /><Text style={styles.legendText}>예측</Text></View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: THEME.white },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  title: { color: THEME.dark, fontSize: 28, fontWeight: '900', letterSpacing: -0.7 },
  subtitle: { color: THEME.muted, fontSize: 13, fontWeight: '700', marginTop: 5 },
  card: { borderWidth: 1.3, borderRadius: 18, padding: 16, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1 },
  cardTitle: { color: THEME.dark, fontSize: 17, fontWeight: '900', marginBottom: 4 },
  cardSub: { color: THEME.muted, fontSize: 13, fontWeight: '700' },
  badge: { minWidth: 60, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  badgeText: { color: THEME.white, fontSize: 16, fontWeight: '900' },
  progressTrack: { height: 10, borderRadius: 999, backgroundColor: THEME.white, marginTop: 15, overflow: 'hidden' },
  progressCurrent: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: THEME.primary, opacity: 0.6 },
  progressFuture: { height: '100%', borderRadius: 999, opacity: 0.8 },
  detailBox: { marginTop: 15, borderRadius: 14, backgroundColor: THEME.white, padding: 14 },
  detailTitle: { color: THEME.dark, fontSize: 15, fontWeight: '900', marginBottom: 7 },
  detailText: { color: '#566173', fontSize: 14, lineHeight: 21, fontWeight: '700' },
  legendRow: { flexDirection: 'row', gap: 18, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  currentDot: { width: 20, height: 4, borderRadius: 2, backgroundColor: THEME.primary },
  futureDot: { width: 20, height: 4, borderRadius: 2 },
  legendText: { color: THEME.muted, fontSize: 12, fontWeight: '800' },
});
