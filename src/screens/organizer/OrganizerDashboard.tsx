import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { mockSectors } from '../../data/mockData';
import { Colors, getRiskColor, getRiskText } from '../../components/Colors';

const PREDICTED_RISKS = [
  { id: '1', sector: 'Sector C', severity: 'critical', timeToRisk: '10분', predictedDensity: 92 },
  { id: '2', sector: 'Sector E', severity: 'warning', timeToRisk: '18분', predictedDensity: 78 },
];

export default function OrganizerDashboard() {
  const navigation = useNavigation<any>();
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const overallStatus = mockSectors.some(s => s.status === 'critical') ? 'critical' :
    mockSectors.some(s => s.status === 'warning') ? 'warning' : 'safe';

  const criticalCount = mockSectors.filter(s => s.status === 'critical').length;
  const warningCount = mockSectors.filter(s => s.status === 'warning').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>🛡️ SafeCrowd</Text>
        <Text style={styles.title}>대시보드</Text>
        <Text style={styles.subtitle}>실시간 현황 모니터링</Text>
      </View>

      <View style={styles.content}>
        {/* Overall Status Card */}
        <Animated.View style={[
          styles.statusCard,
          { opacity: fadeAnim, borderColor: getRiskColor(overallStatus) },
          overallStatus === 'critical' ? { backgroundColor: Colors.dangerLight } :
          overallStatus === 'warning' ? { backgroundColor: Colors.warningLight } :
          { backgroundColor: Colors.successLight }
        ]}>
          <View style={styles.statusRow}>
            <View style={[styles.statusIcon, { backgroundColor: getRiskColor(overallStatus) }]}>
              <Ionicons
                name={overallStatus === 'safe' ? 'checkmark-circle' : 'warning'}
                size={28} color="white"
              />
            </View>
            <View>
              <Text style={styles.statusLabel}>현재 상태</Text>
              <Text style={[styles.statusValue, { color: getRiskColor(overallStatus) }]}>
                {getRiskText(overallStatus)}
              </Text>
            </View>
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusInfoText}>
              총 {mockSectors.length}개 구역 모니터링 중 · 위험 {criticalCount}개 · 주의 {warningCount}개
            </Text>
          </View>
        </Animated.View>

        {/* Sector Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>구역별 현황</Text>
          {mockSectors.map(sector => (
            <TouchableOpacity
              key={sector.id}
              style={styles.sectorCard}
              onPress={() => navigation.navigate('SectorMonitoring', { sectorId: sector.id })}
            >
              <View style={styles.sectorLeft}>
                <View style={[styles.sectorBadge, { backgroundColor: getRiskColor(sector.status) }]}>
                  <Text style={styles.sectorBadgeText}>{sector.id}</Text>
                </View>
                <Text style={styles.sectorName}>{sector.name}</Text>
              </View>
              <View style={styles.sectorRight}>
                <View style={styles.densityBar}>
                  <View style={[
                    styles.densityFill,
                    { width: `${sector.density}%` as any, backgroundColor: getRiskColor(sector.status) }
                  ]} />
                </View>
                <Text style={[styles.densityText, { color: getRiskColor(sector.status) }]}>
                  {sector.density}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Predicted Risks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>위험 예측</Text>
          {PREDICTED_RISKS.map(risk => (
            <View key={risk.id} style={[
              styles.riskCard,
              { borderLeftColor: getRiskColor(risk.severity) }
            ]}>
              <View style={styles.riskHeader}>
                <Text style={[styles.riskSector, { color: getRiskColor(risk.severity) }]}>
                  {risk.sector}
                </Text>
                <Text style={styles.riskTime}>{risk.timeToRisk} 후 위험</Text>
              </View>
              <View style={styles.riskBar}>
                <View style={[
                  styles.riskFill,
                  { width: `${risk.predictedDensity}%` as any, backgroundColor: getRiskColor(risk.severity) }
                ]} />
              </View>
              <Text style={styles.riskDensity}>예측 밀집도: {risk.predictedDensity}%</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>빠른 실행</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: Colors.dangerLight }]}
              onPress={() => navigation.navigate('EmergencyControl')}
            >
              <Ionicons name="megaphone" size={24} color={Colors.danger} />
              <Text style={[styles.quickBtnText, { color: Colors.danger }]}>긴급 알림</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: Colors.primaryLight }]}
              onPress={() => navigation.navigate('InteractiveMap')}
            >
              <Ionicons name="map" size={24} color={Colors.primary} />
              <Text style={[styles.quickBtnText, { color: Colors.primary }]}>인력 배치</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { backgroundColor: Colors.white, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: Colors.border },
  logoText: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textSecondary },
  content: { paddingHorizontal: 24, paddingTop: 20 },
  statusCard: { borderWidth: 2, borderRadius: 20, padding: 20, marginBottom: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  statusIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  statusLabel: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  statusValue: { fontSize: 28, fontWeight: '800' },
  statusInfo: { backgroundColor: Colors.white, borderRadius: 12, padding: 12 },
  statusInfoText: { fontSize: 12, color: Colors.textSecondary },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  sectorCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.background, borderRadius: 14, padding: 14, marginBottom: 8 },
  sectorLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectorBadge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  sectorBadgeText: { color: 'white', fontWeight: '700', fontSize: 13 },
  sectorName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  sectorRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  densityBar: { width: 80, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  densityFill: { height: '100%', borderRadius: 3 },
  densityText: { fontSize: 13, fontWeight: '700', minWidth: 36 },
  riskCard: { backgroundColor: Colors.background, borderRadius: 14, padding: 14, marginBottom: 8, borderLeftWidth: 4 },
  riskHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  riskSector: { fontSize: 15, fontWeight: '700' },
  riskTime: { fontSize: 12, color: Colors.textSecondary },
  riskBar: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  riskFill: { height: '100%', borderRadius: 3 },
  riskDensity: { fontSize: 12, color: Colors.textSecondary },
  quickActions: { flexDirection: 'row', gap: 12 },
  quickBtn: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 16, gap: 8 },
  quickBtnText: { fontSize: 13, fontWeight: '700' },
});
