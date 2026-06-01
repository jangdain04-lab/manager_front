import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import {
  DEMO_MAP_URL,
  DEMO_PLACES,
  DEMO_REFRESH_INTERVAL_MS,
  DEMO_STAFF,
  DemoStaff,
  DemoZone,
  getDemoSecond,
  getDemoStaffFor,
  getDemoStatusBg,
  getDemoStatusColor,
  getDemoStatusLabel,
  getDemoZones,
} from '../../data/demoData';

const THEME = {
  primary: '#55CCC4',
  primaryLight: '#EFFFFD',
  dark: '#111827',
  muted: '#8B95A1',
  border: '#EEF1F4',
  white: '#FFFFFF',
};

type HeatmapMode = 'summary' | 'map';

function getRelocation(zones: DemoZone[]) {
  const danger = [...zones].sort((a, b) => b.rawDensity - a.rawDensity)[0];
  const supply = [...zones].sort((a, b) => a.rawDensity - b.rawDensity)[0];
  return { danger, supply, moveCount: Math.min(2, Math.max(1, supply.staff)) };
}

export default function SectorMonitoring() {
  const [demoSecond, setDemoSecond] = useState(getDemoSecond());
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>('summary');
  const [selectedZone, setSelectedZone] = useState<DemoZone | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [extraStaffByZone, setExtraStaffByZone] = useState<Record<string, DemoStaff[]>>({});
  const [staffSearch, setStaffSearch] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('안전관리');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffSector, setNewStaffSector] = useState<string>(DEMO_PLACES[0].name);

  useEffect(() => {
    const timer = setInterval(() => setDemoSecond(getDemoSecond()), DEMO_REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const zones = useMemo(() => getDemoZones(demoSecond), [demoSecond]);
  const relocation = getRelocation(zones);

  const getStaff = (zoneName: string) => [
    ...getDemoStaffFor(zoneName),
    ...(extraStaffByZone[zoneName] ?? []),
  ];

  const addStaffToZone = (staff: DemoStaff) => {
    if (!selectedZone) return;

    setExtraStaffByZone((prev) => {
      const current = prev[selectedZone.name] ?? [];
      if (current.some((item) => item.name === staff.name) || getDemoStaffFor(selectedZone.name).some((item) => item.name === staff.name)) {
        return prev;
      }

      return {
        ...prev,
        [selectedZone.name]: [...current, { ...staff, sector: selectedZone.name }],
      };
    });
  };

  const registerStaff = () => {
    if (!newStaffName.trim()) {
      Alert.alert('이름 입력 필요', '신규 직원 이름을 입력해 주세요.');
      return;
    }

    const staff: DemoStaff = {
      id: `staff-${Date.now()}`,
      name: newStaffName.trim(),
      role: newStaffRole,
      sector: newStaffSector,
      status: 'active',
    };

    setExtraStaffByZone((prev) => ({
      ...prev,
      [newStaffSector]: [...(prev[newStaffSector] ?? []), staff],
    }));
    setNewStaffName('');
    setNewStaffPhone('');
    setNewStaffEmail('');
    setAddModalVisible(false);
    Alert.alert('직원 등록 완료', `${staff.name} 직원이 ${staff.sector} 구역에 배치되었습니다.`);
  };

  if (selectedZone) {
    const staff = getStaff(selectedZone.name);

    return (
      <View style={styles.screen}>
        <View style={styles.detailHeader}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setSelectedZone(null)}>
            <Ionicons name="arrow-back" size={25} color={THEME.dark} />
          </TouchableOpacity>
          <View style={[styles.detailIcon, { backgroundColor: getDemoStatusColor(selectedZone.status) }]}>
            <Ionicons name="location-outline" size={25} color={THEME.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>{selectedZone.name}</Text>
            <Text style={styles.detailSubtitle}>{selectedZone.camera} · {getDemoStatusLabel(selectedZone.status)} · {selectedZone.count}명</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.detailContent}>
          <View style={styles.detailSectionHeader}>
            <Text style={styles.sectionTitle}>현재 배치 인력</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{staff.length}명</Text>
            </View>
          </View>
          <View style={styles.currentStaffBox}>
            {staff.map((person, index) => (
              <View key={`${person.name}-${index}`} style={styles.personRow}>
                <Ionicons name="person-circle-outline" size={38} color={THEME.primary} />
                <View>
                  <Text style={styles.personName}>{person.name}</Text>
                  <Text style={styles.personRole}>{person.role} · {person.sector}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>전체 직원 목록</Text>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={21} color={THEME.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="이름 검색..."
              placeholderTextColor="#AEB6C2"
              value={staffSearch}
              onChangeText={setStaffSearch}
            />
          </View>
          {DEMO_STAFF.filter((person) => person.name.includes(staffSearch.trim())).map((person) => {
            const alreadyAdded = staff.some((item) => item.name === person.name);
            return (
              <View key={person.name} style={styles.staffListRow}>
                <View style={[styles.checkBox, alreadyAdded && styles.checkBoxSelected]}>
                  {alreadyAdded && <Ionicons name="checkmark" size={17} color={THEME.white} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.personName}>{person.name}</Text>
                  <Text style={styles.personRole}>{person.role} · {person.sector}</Text>
                </View>
                <TouchableOpacity
                  disabled={alreadyAdded}
                  style={[styles.smallButton, alreadyAdded && styles.smallButtonDisabled]}
                  onPress={() => addStaffToZone(person)}
                >
                  <Text style={styles.smallButtonText}>{alreadyAdded ? '완료' : '추가'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.fixedBottom}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setSelectedZone(null)}>
            <Text style={styles.primaryButtonText}>배치 완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>인력 관리</Text>
            <Text style={styles.subtitle}>실시간 히트맵 및 배치 조정</Text>
          </View>
        </View>

        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, heatmapMode === 'summary' && styles.modeButtonActive]}
            onPress={() => setHeatmapMode('summary')}
          >
            <Ionicons name="grid-outline" size={18} color={heatmapMode === 'summary' ? THEME.white : THEME.muted} />
            <Text style={[styles.modeText, heatmapMode === 'summary' && styles.modeTextActive]}>요약 히트맵</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, heatmapMode === 'map' && styles.modeButtonActive]}
            onPress={() => setHeatmapMode('map')}
          >
            <Ionicons name="map-outline" size={18} color={heatmapMode === 'map' ? THEME.white : THEME.muted} />
            <Text style={[styles.modeText, heatmapMode === 'map' && styles.modeTextActive]}>지도 히트맵</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{heatmapMode === 'summary' ? '실시간 히트맵' : '실시간 지도 히트맵'}</Text>

        {heatmapMode === 'summary' ? (
          <View style={styles.homeHeatmapCard}>
            <View style={styles.heatmapGrid}>
              {zones.map((zone) => (
                <TouchableOpacity
                  key={zone.id}
                  style={[styles.heatmapCard, { backgroundColor: getDemoStatusBg(zone.status) }]}
                  onPress={() => setSelectedZone(zone)}
                >
                  <Text style={[styles.levelText, { color: getDemoStatusColor(zone.status) }]}>
                    {getDemoStatusLabel(zone.status)}
                  </Text>
                  <Text style={styles.countText}>{zone.count}명</Text>
                  <Text style={styles.cameraText}>{zone.camera}</Text>
                  <Text style={styles.placeText} numberOfLines={2}>{zone.name}</Text>
                  <View style={styles.staffBadge}>
                    <Ionicons name="people-outline" size={13} color={THEME.primary} />
                    <Text style={styles.staffBadgeText}>{getStaff(zone.name).length}명</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.mapCard}>
            <View style={styles.mapBox}>
              <WebView
                source={{ uri: DEMO_MAP_URL }}
                style={styles.map}
                javaScriptEnabled
                domStorageEnabled
                geolocationEnabled
                originWhitelist={['*']}
                mixedContentMode="always"
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
              {zones.map((zone) => (
                <TouchableOpacity
                  key={zone.id}
                  style={[styles.mapChip, { borderColor: getDemoStatusColor(zone.status) }]}
                  onPress={() => setSelectedZone(zone)}
                >
                  <View style={[styles.chipDot, { backgroundColor: getDemoStatusColor(zone.status) }]} />
                  <Text style={styles.mapChipTitle}>{zone.name}</Text>
                  <Text style={[styles.mapChipStatus, { color: getDemoStatusColor(zone.status) }]}>
                    {getDemoStatusLabel(zone.status)} · {zone.count}명
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>권장 인력 재배치</Text>
          <View style={styles.urgentBadge}><Text style={styles.urgentBadgeText}>긴급</Text></View>
        </View>
        <View style={styles.relocationCard}>
          <View style={styles.relocationTop}>
            <View style={styles.warningIcon}>
              <Ionicons name="warning-outline" size={27} color={THEME.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.relocationTitle}>인력 재배치 필요</Text>
              <Text style={styles.relocationText}>{relocation.danger.name} 혼잡 상승 감지</Text>
            </View>
          </View>
          <View style={styles.relocationDivider} />
          <View style={styles.routeRow}>
            <View style={styles.routeBox}>
              <Text style={styles.routeLabel}>출발 구역</Text>
              <Text style={styles.routePlace}>{relocation.supply.name}</Text>
              <Text style={styles.routeSub}>{relocation.supply.staff}명 배치</Text>
            </View>
            <View style={styles.arrowBlock}>
              <Ionicons name="arrow-forward" size={30} color={THEME.primary} />
              <Text style={styles.moveText}>{relocation.moveCount}명</Text>
            </View>
            <View style={[styles.routeBox, styles.routeBoxDanger]}>
              <Text style={[styles.routeLabel, { color: '#EF4444' }]}>도착 구역</Text>
              <Text style={styles.routePlace}>{relocation.danger.name}</Text>
              <Text style={styles.routeSub}>{relocation.danger.staff}명 배치</Text>
            </View>
          </View>
          <View style={styles.staffChangeBox}>
            <View style={styles.staffChangeItem}>
              <Text style={styles.staffChangeLabel}>현재 인력</Text>
              <Text style={styles.currentStaff}>{relocation.danger.staff}명</Text>
            </View>
            <Ionicons name="arrow-forward" size={30} color={THEME.muted} />
            <View style={styles.staffChangeItem}>
              <Text style={styles.staffChangeLabel}>재배치 후</Text>
              <Text style={styles.afterStaff}>{relocation.danger.staff + relocation.moveCount}명</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => Alert.alert('재배치 적용', `${relocation.supply.name}에서 ${relocation.danger.name}으로 ${relocation.moveCount}명 이동 지시를 보냈습니다.`)}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={THEME.white} />
            <Text style={styles.primaryButtonText}>재배치 적용하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.staffSectionHeader}>
          <Text style={styles.sectionTitle}>전체 인력 관리</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
            <Ionicons name="add" size={28} color={THEME.white} />
          </TouchableOpacity>
        </View>
        {zones.map((zone) => (
          <View key={zone.id} style={styles.staffCard}>
            <View style={styles.staffCardHeader}>
              <View style={styles.staffTitleRow}>
                <View style={[styles.statusDot, { backgroundColor: getDemoStatusColor(zone.status) }]} />
                <Text style={styles.staffCardTitle}>{zone.name}</Text>
                <Text style={styles.staffCardSub}>({getStaff(zone.name).length}명)</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => setSelectedZone(zone)}>
                <Ionicons name="pencil-outline" size={23} color={THEME.muted} />
              </TouchableOpacity>
            </View>
            {getStaff(zone.name).map((person, index) => (
              <View key={`${person.name}-${index}`} style={styles.staffPersonBox}>
                <Ionicons name="person-circle-outline" size={38} color={THEME.primary} />
                <View>
                  <Text style={styles.personName}>{person.name}</Text>
                  <Text style={styles.personRole}>{person.role}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <Modal visible={addModalVisible} transparent animationType="slide" onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <View style={styles.modalIcon}>
                  <Ionicons name="add" size={28} color={THEME.white} />
                </View>
                <View>
                <Text style={styles.modalTitle}>신규 직원 등록</Text>
                <Text style={styles.modalSubtitle}>전체 시스템에 직원을 추가합니다</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.iconButton} onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={23} color={THEME.muted} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>이름</Text>
              <TextInput style={styles.input} placeholder="이름을 입력하세요" placeholderTextColor="#AEB6C2" value={newStaffName} onChangeText={setNewStaffName} />
              <Text style={styles.inputLabel}>역할</Text>
              <View style={styles.choiceRow}>
                {['안전관리', '의료지원'].map((role) => (
                  <TouchableOpacity key={role} style={[styles.choiceChip, newStaffRole === role && styles.choiceChipActive]} onPress={() => setNewStaffRole(role)}>
                    <Text style={[styles.choiceText, newStaffRole === role && styles.choiceTextActive]}>{role}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.inputLabel}>전화번호</Text>
              <TextInput style={styles.input} placeholder="010-0000-0000" placeholderTextColor="#AEB6C2" keyboardType="phone-pad" value={newStaffPhone} onChangeText={setNewStaffPhone} />
              <Text style={styles.inputLabel}>이메일</Text>
              <TextInput style={styles.input} placeholder="example@email.com" placeholderTextColor="#AEB6C2" keyboardType="email-address" value={newStaffEmail} onChangeText={setNewStaffEmail} />
              <Text style={styles.inputLabel}>초기 배치 구역</Text>
              <View style={styles.choiceGrid}>
                {DEMO_PLACES.map((place) => (
                  <TouchableOpacity key={place.id} style={[styles.sectorChoice, newStaffSector === place.name && styles.choiceChipActive]} onPress={() => setNewStaffSector(place.name)}>
                    <Text style={[styles.choiceText, newStaffSector === place.name && styles.choiceTextActive]}>{place.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setAddModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton} onPress={registerStaff}>
                  <Text style={styles.primaryButtonText}>직원 등록</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: THEME.white },
  content: { paddingHorizontal: 20, paddingTop: 66, paddingBottom: 130 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  title: { color: THEME.dark, fontSize: 34, fontWeight: '900', letterSpacing: -0.7 },
  subtitle: { color: THEME.muted, fontSize: 15, fontWeight: '700', marginTop: 8 },
  addButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: THEME.primary, alignItems: 'center', justifyContent: 'center' },
  modeToggle: { flexDirection: 'row', borderRadius: 18, backgroundColor: '#F4F6F8', padding: 5, marginBottom: 22 },
  modeButton: { flex: 1, height: 48, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  modeButtonActive: { backgroundColor: THEME.primary },
  modeText: { color: THEME.muted, fontSize: 15, fontWeight: '900' },
  modeTextActive: { color: THEME.white },
  homeHeatmapCard: { backgroundColor: THEME.white, borderRadius: 24, padding: 14, marginBottom: 26 },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  heatmapCard: { width: '48%', minHeight: 145, borderRadius: 18, padding: 13, marginBottom: 12, justifyContent: 'center' },
  levelText: { fontSize: 18, fontWeight: '900', marginBottom: 7 },
  countText: { color: THEME.dark, fontSize: 24, fontWeight: '900', marginBottom: 7 },
  cameraText: { color: THEME.muted, fontSize: 11, fontWeight: '900' },
  placeText: { color: THEME.dark, fontSize: 14, fontWeight: '900', marginTop: 4 },
  staffBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: THEME.white, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5, marginTop: 10 },
  staffBadgeText: { color: THEME.primary, fontSize: 12, fontWeight: '900' },
  mapCard: { borderRadius: 24, padding: 14, backgroundColor: THEME.white, borderWidth: 1, borderColor: THEME.border, marginBottom: 28 },
  mapBox: { height: 360, borderRadius: 20, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  map: { flex: 1 },
  chipScroll: { gap: 10, paddingVertical: 14 },
  mapChip: { width: 150, borderRadius: 16, borderWidth: 1.5, padding: 12 },
  chipDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 8 },
  mapChipTitle: { color: THEME.dark, fontSize: 14, fontWeight: '900', marginBottom: 5 },
  mapChipStatus: { fontSize: 13, fontWeight: '900' },
  sectionTitle: { color: THEME.dark, fontSize: 22, fontWeight: '900', marginBottom: 14 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  urgentBadge: { borderRadius: 12, backgroundColor: '#D6453D', paddingHorizontal: 15, paddingVertical: 7, marginBottom: 14 },
  urgentBadgeText: { color: THEME.white, fontSize: 14, fontWeight: '900' },
  relocationCard: { borderRadius: 20, borderWidth: 1.5, borderColor: '#F2CACA', backgroundColor: '#FFF7F7', padding: 18, marginBottom: 28 },
  relocationTop: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  relocationDivider: { height: 1, backgroundColor: '#F2CACA', marginBottom: 18 },
  warningIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  relocationTitle: { color: THEME.dark, fontSize: 20, fontWeight: '900', marginBottom: 5 },
  relocationText: { color: '#EF4444', fontSize: 14, fontWeight: '800' },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  routeBox: { flex: 1, borderRadius: 16, borderWidth: 1.5, borderColor: THEME.primary, backgroundColor: THEME.primaryLight, padding: 13 },
  routeBoxDanger: { borderColor: '#EF4444', backgroundColor: '#FFFFFF' },
  routeLabel: { color: THEME.primary, fontSize: 12, fontWeight: '900', marginBottom: 7 },
  routePlace: { color: THEME.dark, fontSize: 16, fontWeight: '900', marginBottom: 6 },
  routeSub: { color: THEME.muted, fontSize: 12, fontWeight: '800' },
  arrowBlock: { width: 58, alignItems: 'center' },
  moveText: { color: '#EF4444', fontSize: 13, fontWeight: '900', marginTop: 4 },
  staffChangeBox: { borderRadius: 16, backgroundColor: THEME.white, paddingVertical: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  staffChangeItem: { alignItems: 'center' },
  staffChangeLabel: { color: THEME.muted, fontSize: 13, fontWeight: '800', marginBottom: 4 },
  currentStaff: { color: '#D6453D', fontSize: 28, fontWeight: '900' },
  afterStaff: { color: THEME.primary, fontSize: 28, fontWeight: '900' },
  primaryButton: { height: 55, borderRadius: 14, backgroundColor: THEME.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: THEME.white, fontSize: 16, fontWeight: '900' },
  staffSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  staffCard: { borderRadius: 17, borderWidth: 1, borderColor: THEME.border, padding: 16, marginBottom: 12 },
  staffCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  staffTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 11, height: 11, borderRadius: 6, marginRight: 12 },
  staffCardTitle: { color: THEME.dark, fontSize: 17, fontWeight: '900' },
  staffCardSub: { color: THEME.muted, fontSize: 13, fontWeight: '700', marginLeft: 7 },
  editButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  staffPersonBox: { minHeight: 64, borderRadius: 14, backgroundColor: '#F8FAFB', flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, marginTop: 10 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', paddingTop: 66, paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: THEME.border, gap: 12 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F4F6F8', alignItems: 'center', justifyContent: 'center' },
  detailIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  detailTitle: { color: THEME.dark, fontSize: 23, fontWeight: '900' },
  detailSubtitle: { color: THEME.muted, fontSize: 13, fontWeight: '700', marginTop: 4 },
  detailContent: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 120 },
  detailSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  countBadge: { borderRadius: 16, backgroundColor: THEME.primary, paddingHorizontal: 14, paddingVertical: 7 },
  countBadgeText: { color: THEME.white, fontSize: 14, fontWeight: '900' },
  currentStaffBox: { minHeight: 110, borderRadius: 18, backgroundColor: THEME.white, borderWidth: 1, borderColor: THEME.border, padding: 12, marginBottom: 28 },
  personRow: { minHeight: 72, borderRadius: 16, backgroundColor: '#F8FAFB', flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 16, marginBottom: 10 },
  personName: { color: THEME.dark, fontSize: 16, fontWeight: '900' },
  personRole: { color: THEME.muted, fontSize: 13, fontWeight: '700', marginTop: 3 },
  staffListRow: { minHeight: 78, borderRadius: 16, borderWidth: 1, borderColor: THEME.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 10 },
  searchBox: { height: 58, borderRadius: 16, backgroundColor: THEME.white, borderWidth: 1, borderColor: THEME.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10, marginBottom: 14 },
  searchInput: { flex: 1, color: THEME.dark, fontSize: 15, fontWeight: '700' },
  checkBox: { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, borderColor: '#DDE2E8', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkBoxSelected: { backgroundColor: THEME.primary, borderColor: THEME.primary },
  smallButton: { width: 58, height: 42, borderRadius: 13, backgroundColor: THEME.primary, alignItems: 'center', justifyContent: 'center' },
  smallButtonDisabled: { backgroundColor: '#C8D0D8' },
  smallButtonText: { color: THEME.white, fontSize: 14, fontWeight: '900' },
  fixedBottom: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 20, backgroundColor: THEME.white, borderTopWidth: 1, borderTopColor: THEME.border },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(17,24,39,0.55)', justifyContent: 'flex-end' },
  modalSheet: { maxHeight: '92%', backgroundColor: THEME.white, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 24, paddingBottom: 34 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { color: THEME.dark, fontSize: 23, fontWeight: '900' },
  modalSubtitle: { color: THEME.muted, fontSize: 14, fontWeight: '700', marginTop: 4 },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  modalIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: THEME.primary, alignItems: 'center', justifyContent: 'center' },
  inputLabel: { color: THEME.muted, fontSize: 13, fontWeight: '900', marginBottom: 7 },
  input: { height: 58, borderRadius: 14, backgroundColor: '#F8FAFB', paddingHorizontal: 16, color: THEME.dark, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  choiceRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  choiceGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  choiceChip: { flex: 1, height: 48, borderRadius: 13, backgroundColor: '#F8FAFB', borderWidth: 1, borderColor: THEME.border, alignItems: 'center', justifyContent: 'center' },
  sectorChoice: { width: '48%', minHeight: 48, borderRadius: 13, backgroundColor: '#F8FAFB', borderWidth: 1, borderColor: THEME.border, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, marginBottom: 10 },
  choiceChipActive: { backgroundColor: THEME.primaryLight, borderColor: THEME.primary },
  choiceText: { color: THEME.muted, fontSize: 14, fontWeight: '900', textAlign: 'center' },
  choiceTextActive: { color: THEME.primary },
  modalButtonRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelButton: { flex: 1, height: 54, borderRadius: 14, backgroundColor: '#F4F6F8', alignItems: 'center', justifyContent: 'center' },
  cancelButtonText: { color: THEME.dark, fontSize: 16, fontWeight: '900' },
  registerButton: { flex: 1, height: 54, borderRadius: 14, backgroundColor: THEME.primary, alignItems: 'center', justifyContent: 'center' },
});
