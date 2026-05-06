import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../components/Colors';

const THEME = {
  primary: '#55CCC4',
  primaryLight: '#EFFFFD',
  dark: '#111827',
};

type Staff = {
  name: string;
  role: string;
  sector: string;
};

type Sector = {
  id: number;
  title: string;
  status: 'danger' | 'safe' | 'warning';
  people: Staff[];
};

const initialSectorStaff: Sector[] = [
  {
    id: 1,
    title: '백년관 버정길',
    status: 'danger',
    people: [{ name: '김민수', role: '안전관리', sector: '백년관 버정길' }],
  },
  {
    id: 2,
    title: '자연과학대 앞',
    status: 'safe',
    people: [
      { name: '이지은', role: '안전관리', sector: '자연과학대 앞' },
      { name: '박준호', role: '의료지원', sector: '자연과학대 앞' },
      { name: '최수진', role: '안전관리', sector: '자연과학대 앞' },
    ],
  },
  {
    id: 3,
    title: '공대 흡연부스 옆',
    status: 'warning',
    people: [
      { name: '정다운', role: '안전관리', sector: '공대 흡연부스 옆' },
      { name: '강태영', role: '의료지원', sector: '공대 흡연부스 옆' },
    ],
  },
  {
    id: 4,
    title: '인경관 주차장 입구',
    status: 'safe',
    people: [
      { name: '윤서연', role: '안전관리', sector: '인경관 주차장 입구' },
      { name: '한지훈', role: '안전관리', sector: '인경관 주차장 입구' },
    ],
  },
  {
    id: 5,
    title: '공대-백년관 사이',
    status: 'warning',
    people: [
      { name: '임유진', role: '의료지원', sector: '공대-백년관 사이' },
      { name: '송민재', role: '안전관리', sector: '공대-백년관 사이' },
    ],
  },
  {
    id: 6,
    title: '백년관 잔디구장',
    status: 'safe',
    people: [
      { name: '조서영', role: '안전관리', sector: '백년관 잔디구장' },
      { name: '배현우', role: '의료지원', sector: '백년관 잔디구장' },
      { name: '류지민', role: '안전관리', sector: '백년관 잔디구장' },
    ],
  },
];

const allStaff: Staff[] = [
  { name: '김민수', role: '안전관리', sector: '백년관 버정길' },
  { name: '이지은', role: '안전관리', sector: '자연과학대 앞' },
  { name: '박준호', role: '의료지원', sector: '자연과학대 앞' },
  { name: '최수진', role: '안전관리', sector: '자연과학대 앞' },
  { name: '정다운', role: '안전관리', sector: '공대 흡연부스 옆' },
  { name: '강태영', role: '의료지원', sector: '공대 흡연부스 옆' },
  { name: '윤서연', role: '안전관리', sector: '인경관 주차장 입구' },
  { name: '한지훈', role: '안전관리', sector: '인경관 주차장 입구' },
  { name: '임유진', role: '의료지원', sector: '공대-백년관 사이' },
  { name: '송민재', role: '안전관리', sector: '공대-백년관 사이' },
  { name: '조서영', role: '안전관리', sector: '백년관 잔디구장' },
  { name: '배현우', role: '의료지원', sector: '백년관 잔디구장' },
  { name: '류지민', role: '안전관리', sector: '백년관 잔디구장' },
];

export default function SectorMonitoring() {
  const [sectors, setSectors] = useState<Sector[]>(initialSectorStaff);
  const [selectedSectorId, setSelectedSectorId] = useState<number | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const selectedSector =
    sectors.find((sector) => sector.id === selectedSectorId) ?? null;

  const addStaffToSector = (staff: Staff) => {
    if (!selectedSector) return;

    const alreadyAdded = selectedSector.people.some(
      (person) => person.name === staff.name
    );

    if (alreadyAdded) return;

    setSectors((prev) =>
      prev.map((sector) =>
        sector.id === selectedSector.id
          ? {
              ...sector,
              people: [
                ...sector.people,
                {
                  ...staff,
                  sector: selectedSector.title,
                },
              ],
            }
          : sector
      )
    );
  };

  if (selectedSector) {
    return (
      <View style={styles.detailScreen}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.backButton}
            onPress={() => setSelectedSectorId(null)}
          >
            <Ionicons name="arrow-back" size={25} color={THEME.dark} />
          </TouchableOpacity>

          <View style={styles.locationIcon}>
            <Ionicons name="location-outline" size={25} color="#FFFFFF" />
          </View>

          <Text style={styles.detailTitle}>{selectedSector.title} 인력 관리</Text>
        </View>

        <ScrollView
          style={styles.detailContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.detailScrollContent}
        >
          <View style={styles.detailSectionHeader}>
            <Text style={styles.detailSectionTitle}>현재 섹터 인원</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {selectedSector.people.length}명
              </Text>
            </View>
          </View>

          <View style={styles.currentStaffBox}>
            {selectedSector.people.length === 0 ? (
              <>
                <View style={styles.emptyIconBox}>
                  <Ionicons name="person-circle-outline" size={44} color="#AEB6C2" />
                </View>
                <Text style={styles.emptyTitle}>현재 배치된 인원이 없습니다</Text>
                <Text style={styles.emptySubtitle}>아래에서 직원을 선택하여 추가하세요</Text>
              </>
            ) : (
              selectedSector.people.map((person, index) => (
                <View key={`${person.name}-${index}`} style={styles.currentPersonRow}>
                  <View style={styles.detailPersonIcon}>
                    <Ionicons name="person-circle-outline" size={34} color="#8E98A8" />
                  </View>
                  <View>
                    <Text style={styles.detailPersonName}>{person.name}</Text>
                    <Text style={styles.detailPersonRole}>{person.role}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <Text style={styles.detailSectionTitle}>전체 직원 명단</Text>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={22} color="#AEB6C2" />
            <TextInput
              style={styles.searchInput}
              placeholder="이름 검색..."
              placeholderTextColor="#AEB6C2"
            />
          </View>

          {allStaff.map((staff, index) => {
            const alreadyAdded = selectedSector.people.some(
              (person) => person.name === staff.name
            );

            return (
              <View key={`${staff.name}-${index}`} style={styles.staffListCard}>
                <View
                  style={[
                    styles.checkBox,
                    alreadyAdded && styles.checkBoxSelected,
                  ]}
                >
                  {alreadyAdded && (
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  )}
                </View>

                <View style={styles.listPersonIcon}>
                  <Ionicons name="person-circle-outline" size={38} color="#8E98A8" />
                </View>

                <View style={styles.listPersonInfo}>
                  <Text style={styles.listPersonName}>{staff.name}</Text>
                  <Text style={styles.listPersonRole}>
                    {staff.role} · {staff.sector}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.smallAddButton,
                    alreadyAdded && styles.smallAddButtonDisabled,
                  ]}
                  disabled={alreadyAdded}
                  onPress={() => addStaffToSector(staff)}
                >
                  <Text style={styles.smallAddButtonText}>
                    {alreadyAdded ? '완료' : '추가'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.bottomFixedButtonWrap}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.completeButton}
            onPress={() => setSelectedSectorId(null)}
          >
            <Text style={styles.completeButtonText}>배치 완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>인력 관리</Text>
        <Text style={styles.subtitle}>실시간 히트맵 및 배치 조정</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>실시간 히트맵</Text>

        <View style={styles.heatmapCard}>
          <View style={styles.heatmapGrid}>
            <View style={[styles.heatmapItem, { backgroundColor: '#F3D3D3' }]}>
              <Text style={[styles.heatmapName, { color: '#E93035' }]}>백년관 버정길</Text>
              <Text style={styles.heatmapCount}>51명</Text>
              <View style={styles.peopleRow}>
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
              </View>
              <View style={styles.staffBadge}>
                <Ionicons name="people-outline" size={14} color={THEME.primary} />
                <Text style={styles.staffBadgeText}>1명</Text>
              </View>
            </View>

            <View style={[styles.heatmapItem, { backgroundColor: '#D9EBDC' }]}>
              <Text style={[styles.heatmapName, { color: '#16A34A' }]}>자연과학대 앞</Text>
              <Text style={styles.heatmapCount}>28명</Text>
              <View style={styles.peopleRow}>
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
              </View>
              <View style={styles.staffBadge}>
                <Ionicons name="people-outline" size={14} color={THEME.primary} />
                <Text style={styles.staffBadgeText}>3명</Text>
              </View>
            </View>

            <View style={[styles.heatmapItem, { backgroundColor: '#F7EBD2' }]}>
              <Text style={[styles.heatmapName, { color: '#F59E0B' }]}>공대 흡연부스 옆</Text>
              <Text style={styles.heatmapCount}>37명</Text>
              <View style={styles.peopleRow}>
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
              </View>
              <View style={styles.staffBadge}>
                <Ionicons name="people-outline" size={14} color={THEME.primary} />
                <Text style={styles.staffBadgeText}>2명</Text>
              </View>
            </View>

            <View style={[styles.heatmapItem, { backgroundColor: '#D9EBDC' }]}>
              <Text style={[styles.heatmapName, { color: '#16A34A' }]}>인경관 주차장 입구</Text>
              <Text style={styles.heatmapCount}>17명</Text>
              <View style={styles.peopleRow}>
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
              </View>
              <View style={styles.staffBadge}>
                <Ionicons name="people-outline" size={14} color={THEME.primary} />
                <Text style={styles.staffBadgeText}>2명</Text>
              </View>
            </View>

            <View style={[styles.heatmapItem, { backgroundColor: '#F7EBD2' }]}>
              <Text style={[styles.heatmapName, { color: '#F59E0B' }]}>공대-백년관 사이</Text>
              <Text style={styles.heatmapCount}>33명</Text>
              <View style={styles.peopleRow}>
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
              </View>
              <View style={styles.staffBadge}>
                <Ionicons name="people-outline" size={14} color={THEME.primary} />
                <Text style={styles.staffBadgeText}>2명</Text>
              </View>
            </View>

            <View style={[styles.heatmapItem, { backgroundColor: '#D9EBDC' }]}>
              <Text style={[styles.heatmapName, { color: '#16A34A' }]}>백년관 잔디구장</Text>
              <Text style={styles.heatmapCount}>24명</Text>
              <View style={styles.peopleRow}>
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
                <Ionicons name="person-circle-outline" size={28} color={THEME.primary} />
              </View>
              <View style={styles.staffBadge}>
                <Ionicons name="people-outline" size={14} color={THEME.primary} />
                <Text style={styles.staffBadgeText}>3명</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#16A34A' }]} />
            <Text style={styles.legendText}>여유</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>주의</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#E93035' }]} />
            <Text style={styles.legendText}>위험</Text>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>권장 인력 재배치</Text>
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentBadgeText}>긴급</Text>
          </View>
        </View>

        <View style={styles.relocationCard}>
          <View style={styles.relocationTop}>
            <View style={styles.relocationIcon}>
              <Ionicons name="warning-outline" size={36} color="#FFFFFF" />
            </View>

            <View style={styles.relocationTextBlock}>
              <Text style={styles.relocationTitle}>인력 재배치 필요</Text>
              <Text style={styles.relocationSubtitle}>백년관 버정길 위험 수준 감지</Text>
            </View>
          </View>

          <View style={styles.relocationDivider} />

          <View style={styles.routeRow}>
            <View style={styles.fromBox}>
              <Text style={styles.routeLabelMint}>출발 구역</Text>
              <Text style={styles.routePlace}>자연과학대 앞</Text>
              <Text style={styles.routeStaff}>3명 배치</Text>
            </View>

            <View style={styles.arrowBlock}>
              <Ionicons name="arrow-forward" size={42} color={THEME.primary} />
              <Text style={styles.moveCount}>2명</Text>
            </View>

            <View style={styles.toBox}>
              <Text style={styles.routeLabelDanger}>도착 구역</Text>
              <Text style={styles.routePlace}>백년관 버정길</Text>
              <Text style={styles.routeStaff}>1명 배치</Text>
            </View>
          </View>

          <View style={styles.staffChangeBox}>
            <View style={styles.staffChangeItem}>
              <Text style={styles.staffChangeLabel}>현재 인력</Text>
              <Text style={styles.currentStaff}>1명</Text>
            </View>

            <Ionicons name="arrow-forward" size={34} color="#9CA3AF" />

            <View style={styles.staffChangeItem}>
              <Text style={styles.staffChangeLabel}>재배치 후</Text>
              <Text style={styles.afterStaff}>3명</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.applyButton}>
            <Ionicons name="checkmark-circle-outline" size={21} color="#FFFFFF" />
            <Text style={styles.applyButtonText}>재배치 적용하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.staffSectionHeader}>
          <Text style={styles.staffSectionTitle}>전체 인력 관리</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Ionicons name="add" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {sectors.map((section) => (
          <View key={section.id} style={styles.staffCard}>
            <View style={styles.staffCardHeader}>
              <View style={styles.staffTitleRow}>
                <View
                  style={[
                    styles.statusDot,
                    section.status === 'danger'
                      ? styles.dangerDot
                      : section.status === 'warning'
                        ? styles.warningDot
                        : styles.safeDot,
                  ]}
                />
                <Text style={styles.staffLocation}>{section.title}</Text>
                <Text style={styles.staffCount}>({section.people.length}명)</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.editButton}
                onPress={() => setSelectedSectorId(section.id)}
              >
                <Ionicons name="pencil-outline" size={24} color="#9AA3B2" />
              </TouchableOpacity>
            </View>

            {section.people.map((person, index) => (
              <View key={`${person.name}-${index}`} style={styles.personBox}>
                <View style={styles.personIconBox}>
                  <Ionicons
                    name="person-circle-outline"
                    size={34}
                    color={THEME.primary}
                  />
                </View>

                <View>
                  <Text style={styles.personName}>{person.name}</Text>
                  <Text style={styles.personRole}>{person.role}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={{ height: 80 }} />
      </View>

      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <Ionicons name="add" size={34} color="#FFFFFF" />
              </View>

              <View style={styles.modalTitleBlock}>
                <Text style={styles.modalTitle}>신규 직원 등록</Text>
                <Text style={styles.modalSubtitle}>전체 시스템에 추가</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.closeButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력하세요"
              placeholderTextColor="#B6BEC9"
            />

            <Text style={styles.inputLabel}>역할</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.selectInput}>
              <Text style={styles.selectText}>역할 선택</Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>전화번호</Text>
            <TextInput
              style={styles.input}
              placeholder="010-0000-0000"
              placeholderTextColor="#B6BEC9"
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>이메일</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor="#B6BEC9"
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>초기 배치 섹터</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.selectInput}>
              <Text style={styles.selectText}>섹터 선택</Text>
            </TouchableOpacity>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.cancelButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.registerButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.registerButtonText}>직원 등록</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  scrollContent: {
    paddingBottom: 110,
  },

  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 28,
    paddingTop: 76,
    paddingBottom: 34,
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
    color: THEME.dark,
    marginBottom: 8,
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 17,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.dark,
    letterSpacing: -0.5,
    marginBottom: 16,
  },

  heatmapCard: {
    backgroundColor: Colors.white,
    borderRadius: 26,
    padding: 16,
    marginBottom: 18,
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
    rowGap: 12,
  },

  heatmapItem: {
    width: '31%',
    minHeight: 146,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 12,
  },

  heatmapName: {
    fontSize: 13.5,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },

  heatmapCount: {
    fontSize: 18,
    color: THEME.dark,
    fontWeight: '900',
    marginBottom: 10,
  },

  peopleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 30,
    marginBottom: 5,
  },

  staffBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  staffBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.primary,
  },

  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 38,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendText: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '800',
  },

  urgentBadge: {
    backgroundColor: '#D6453D',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  urgentBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  relocationCard: {
    borderWidth: 2,
    borderColor: '#E0463E',
    backgroundColor: '#FFF1F1',
    borderRadius: 20,
    marginBottom: 34,
    overflow: 'hidden',
  },

  relocationTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
    gap: 16,
  },

  relocationIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#D6453D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  relocationTextBlock: {
    flex: 1,
  },

  relocationTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: THEME.dark,
    marginBottom: 6,
  },

  relocationSubtitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D6453D',
  },

  relocationDivider: {
    height: 1,
    backgroundColor: '#F2CACA',
  },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 18,
  },

  fromBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: THEME.primary,
    backgroundColor: THEME.primaryLight,
    borderRadius: 18,
    padding: 14,
  },

  toBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#D6453D',
    backgroundColor: '#FFF7F7',
    borderRadius: 18,
    padding: 14,
  },

  routeLabelMint: {
    color: THEME.primary,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
  },

  routeLabelDanger: {
    color: '#D6453D',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
  },

  routePlace: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.dark,
    marginBottom: 8,
  },

  routeStaff: {
    fontSize: 14,
    color: '#8B95A1',
    fontWeight: '800',
  },

  arrowBlock: {
    width: 64,
    alignItems: 'center',
  },

  moveCount: {
    fontSize: 15,
    fontWeight: '900',
    color: '#D6453D',
    marginTop: 6,
  },

  staffChangeBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginBottom: 18,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  staffChangeItem: {
    alignItems: 'center',
  },

  staffChangeLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8B95A1',
    marginBottom: 5,
  },

  currentStaff: {
    fontSize: 32,
    fontWeight: '900',
    color: '#D6453D',
  },

  afterStaff: {
    fontSize: 32,
    fontWeight: '900',
    color: THEME.primary,
  },

  applyButton: {
    height: 54,
    marginHorizontal: 18,
    marginBottom: 22,
    borderRadius: 14,
    backgroundColor: THEME.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  applyButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  staffSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  staffSectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.dark,
    letterSpacing: -0.5,
  },

  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 6,
  },

  staffCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  staffCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  staffTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },

  dangerDot: {
    backgroundColor: '#D1433F',
  },

  warningDot: {
    backgroundColor: '#F59E0B',
  },

  safeDot: {
    backgroundColor: '#4FA45B',
  },

  staffLocation: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.dark,
  },

  staffCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B95A1',
    marginLeft: 8,
  },

  editButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  personBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F9',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 14,
    marginTop: 10,
  },

  personIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1.5,
    borderColor: '#DDF8F5',
  },

  personName: {
    fontSize: 17,
    fontWeight: '900',
    color: THEME.dark,
    marginBottom: 4,
  },

  personRole: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9AA3B2',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    justifyContent: 'flex-end',
  },

  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 32,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  modalIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  modalTitleBlock: {
    flex: 1,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: THEME.dark,
    marginBottom: 6,
  },

  modalSubtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9AA3B2',
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9AA3B2',
    marginBottom: 8,
  },

  input: {
    height: 62,
    borderRadius: 14,
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '700',
    color: THEME.dark,
    marginBottom: 18,
  },

  selectInput: {
    height: 62,
    borderRadius: 14,
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginBottom: 18,
  },

  selectText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.dark,
  },

  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },

  cancelButton: {
    flex: 1,
    height: 62,
    borderRadius: 14,
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: THEME.dark,
  },

  registerButton: {
    flex: 1,
    height: 62,
    borderRadius: 14,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.primary,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  registerButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  detailScreen: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },

  detailHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: 78,
    paddingHorizontal: 26,
    paddingBottom: 34,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F3',
  },

  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  locationIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  detailTitle: {
    flex: 1,
    fontSize: 25,
    fontWeight: '900',
    color: THEME.dark,
    letterSpacing: -0.6,
  },

  detailContainer: {
    flex: 1,
  },

  detailScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 130,
  },

  detailSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  detailSectionTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: THEME.dark,
    marginBottom: 14,
    letterSpacing: -0.4,
  },

  countBadge: {
    backgroundColor: THEME.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },

  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  currentStaffBox: {
    minHeight: 220,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
    marginBottom: 32,
  },

  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F4F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#8B95A1',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#AEB6C2',
  },

  currentPersonRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },

  detailPersonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  detailPersonName: {
    fontSize: 17,
    fontWeight: '900',
    color: THEME.dark,
    marginBottom: 4,
  },

  detailPersonRole: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B95A1',
  },

  searchBox: {
    height: 62,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '700',
    color: THEME.dark,
  },

  staffListCard: {
    minHeight: 98,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E1E5EA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  checkBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 1.8,
    borderColor: '#DDE2E8',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkBoxSelected: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },

  listPersonIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F4F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  listPersonInfo: {
    flex: 1,
  },

  listPersonName: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.dark,
    marginBottom: 5,
  },

  listPersonRole: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B95A1',
  },

  smallAddButton: {
    width: 58,
    height: 44,
    borderRadius: 14,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallAddButtonDisabled: {
    backgroundColor: '#C8D0D8',
  },

  smallAddButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  bottomFixedButtonWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF0F3',
  },

  completeButton: {
    height: 70,
    borderRadius: 18,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.primary,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  completeButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});