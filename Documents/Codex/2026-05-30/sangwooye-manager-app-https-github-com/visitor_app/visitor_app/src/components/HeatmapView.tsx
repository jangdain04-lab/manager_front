import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import {
  getRiskBg,
  getRiskColor,
  getRiskText,
  type CrowdZone,
} from '../data/mockData';
import { createVisitorReport, fetchPublicLiveZones, fetchPublicMapUrl, resolveBackendUrl } from '../services/api';

const COLORS = {
  text: '#111827',
  muted: '#8B95A1',
  mint: '#7BCBC6',
  danger: '#E24743',
  warning: '#ECA12D',
  relaxed: '#5DBB88',
  mapBg: '#E7E7E7',
  line: '#E9EDF2',
};

type ReportChoice = 'current' | 'place' | 'organizer';

const SHOW_LOCAL_RISK_MARKERS = false;

function useResponsive() {
  const { width, height } = useWindowDimensions();
  const base = Math.min(width, height);
  const scale = Math.min(Math.max(base / 390, 0.86), 1.16);
  const horizontal = Math.max(22, Math.min(34, width * 0.085));
  const mapHeight = Math.max(370, Math.min(height * 0.52, 485));

  return { width, height, scale, horizontal, mapHeight };
}

export function HeatmapView() {
  const { width, scale, horizontal, mapHeight } = useResponsive();
  const [zones, setZones] = useState<CrowdZone[]>([]);
  const [mapUrl, setMapUrl] = useState(resolveBackendUrl());
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<CrowdZone | null>(null);

  const loadLiveZones = useCallback(async () => {
    try {
      const liveZones = await fetchPublicLiveZones();

      setZones(liveZones);
    } catch (err) {
      console.warn('Failed to load live zones', err);
    }
  }, []);

  useEffect(() => {
    loadLiveZones();
    fetchPublicMapUrl()
      .then(setMapUrl)
      .catch((error) => console.warn('Failed to load map URL', error));

    const id = setInterval(loadLiveZones, 1000);

    return () => clearInterval(id);
  }, [loadLiveZones]);

  const cardGap = 12;

  const cardWidth = useMemo(() => {
    const available = width - horizontal * 2 - cardGap * 2;
    return Math.floor(available / 3);
  }, [width, horizontal]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: horizontal,
            paddingTop: 34 * scale,
            paddingBottom: 28 * scale,
          },
        ]}
      >
        <View style={styles.titleBlock}>
          <Text
            style={[styles.title, { fontSize: 33 * scale }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            안전 모니터링
          </Text>

          <Text style={[styles.subtitle, { fontSize: 15 * scale }]}>
            실시간 인파 혼잡도 히트맵
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.reportButton, { height: 56 * scale }]}
          activeOpacity={0.86}
          onPress={() => setReportOpen(true)}
        >
          <Ionicons
            name="alert-circle-outline"
            size={19 * scale}
            color="#E46D6A"
          />
          <Text style={[styles.reportText, { fontSize: 14 * scale }]}>
            빠른 신고하기
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 26 }}
      >
        <View style={[styles.mapArea, { height: mapHeight }]}>
          <WebView
            source={{
              uri: mapUrl,
              headers: { 'ngrok-skip-browser-warning': 'true' },
            }}
            style={styles.mapWebView}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            scalesPageToFit
            scrollEnabled={false}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderLoading={() => (
              <View style={styles.mapLoading}>
                <Text style={styles.mapLoadingText}>지도 연결 중</Text>
              </View>
            )}
            renderError={() => (
              <View style={styles.mapLoading}>
                <Text style={styles.mapLoadingText}>
                  지도 연결을 확인해주세요
                </Text>
              </View>
            )}
          />

          {SHOW_LOCAL_RISK_MARKERS && (
            <View pointerEvents="none" style={styles.markerLayer}>
              {zones.map((zone) => (
                <HeatMarker
                  key={zone.id}
                  zone={zone}
                  mapHeight={mapHeight}
                />
              ))}
            </View>
          )}

          <View style={styles.mapControlGroup}>
            <TouchableOpacity
              style={styles.mapControl}
              onPress={loadLiveZones}
            >
              <Ionicons
                name="refresh"
                size={25 * scale}
                color={COLORS.mint}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.mapControl}>
              <Ionicons
                name="locate-outline"
                size={25 * scale}
                color={COLORS.mint}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.densitySection,
            {
              paddingHorizontal: horizontal,
              paddingTop: 34 * scale,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                fontSize: 29 * scale,
                marginBottom: 22 * scale,
              },
            ]}
          >
            구역별 밀집도
          </Text>

          <View style={[styles.grid, { gap: cardGap }]}>
            {zones.map((zone) => (
              <DensityCard
                key={zone.id}
                zone={zone}
                width={cardWidth}
                scale={scale}
                onPress={() => setSelectedZone(zone)}
              />
            ))}
            {zones.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>표시할 구역 데이터가 없습니다.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <ReportModal
        visible={reportOpen}
        zones={zones}
        onClose={() => setReportOpen(false)}
      />

      <ZoneDetailModal
        zone={selectedZone}
        onClose={() => setSelectedZone(null)}
        onRefresh={loadLiveZones}
      />
    </SafeAreaView>
  );
}

function HeatMarker({
  zone,
  mapHeight,
}: {
  zone: CrowdZone;
  mapHeight: number;
}) {
  const color = getRiskColor(zone.riskLevel);
  const size = zone.riskLevel === 'danger' ? 48 : 46;

  return (
    <View
      style={[
        styles.markerWrap,
        {
          left: `${zone.gridPos.x}%`,
          top: Math.min(
            mapHeight - 70,
            Math.max(30, (zone.gridPos.y / 100) * mapHeight),
          ),
        },
      ]}
    >
      <View
        style={[
          styles.marker,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      >
        <Text style={styles.markerText}>
          {getRiskText(zone.riskLevel)}
        </Text>
      </View>
    </View>
  );
}

function DensityCard({
  zone,
  width,
  scale,
  onPress,
}: {
  zone: CrowdZone;
  width: number;
  scale: number;
  onPress: () => void;
}) {
  const color = getRiskColor(zone.riskLevel);

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[
        styles.densityCard,
        {
          width,
          backgroundColor: getRiskBg(zone.riskLevel),
          minHeight: 108 * scale,
        },
      ]}
    >
      <Text
        style={[
          styles.zoneName,
          {
            color,
            fontSize: 13 * scale,
          },
        ]}
        numberOfLines={2}
      >
        {zone.name}
      </Text>

      <Text
        style={[
          styles.people,
          {
            color,
            fontSize: 21 * scale,
          },
        ]}
      >
        {zone.peopleCount}명
      </Text>
    </TouchableOpacity>
  );
}

function ReportModal({
  visible,
  zones,
  onClose,
}: {
  visible: boolean;
  zones: CrowdZone[];
  onClose: () => void;
}) {
  const [choice, setChoice] = useState<ReportChoice | null>(null);
  const [placeSelectorOpen, setPlaceSelectorOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState('공대 정류장');
  const [memo, setMemo] = useState('');
  const [selectedReportZone, setSelectedReportZone] = useState<CrowdZone | null>(zones[0] ?? null);
  const [isSending, setIsSending] = useState(false);

  const selectPlace = (zone: CrowdZone) => {
    setSelectedPlace(zone.name);
    setSelectedReportZone(zone);
    setChoice('place');
    setPlaceSelectorOpen(false);
  };

  const closeAll = () => {
    setChoice(null);
    setMemo('');
    setSelectedReportZone(zones[0] ?? null);
    onClose();
  };

  const submitReport = async () => {
    if (!choice || isSending) return;

    const reportZone = choice === 'current'
      ? zones[0]
      : choice === 'place'
        ? selectedReportZone
        : null;

    setIsSending(true);

    try {
      await createVisitorReport({
        type: choice,
        zoneId: reportZone?.id,
        zoneName: reportZone?.name,
        memo: choice === 'organizer' ? memo.trim() : undefined,
      });
      closeAll();
    } catch (err) {
      console.warn('Failed to submit visitor report', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.backdrop}>
          <View style={styles.reportSheet}>
            <View style={styles.reportTop}>
              <View style={styles.reportIcon}>
                <Ionicons name="radio-outline" size={23} color="#fff" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.reportTitle}>상황 보고하기</Text>
                <Text style={styles.reportSubtitle}>
                  manager 운영 화면으로 상황을 전송합니다
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={24} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            <View style={styles.reportDivider} />

            <ReportOption
              icon="location-outline"
              title="현재 위치 및 상황 보고"
              selected={choice === 'current'}
              onPress={() => {
                setSelectedReportZone(zones[0] ?? null);
                setChoice('current');
              }}
            />

            <ReportOption
              icon="location-outline"
              title="직접 장소 선택"
              subtitle={choice === 'place' ? selectedPlace : undefined}
              selected={choice === 'place'}
              hasChevron
              onPress={() => setPlaceSelectorOpen(true)}
            />

            <ReportOption
              icon="warning-outline"
              title="위험상황 주최자에게 제보"
              selected={choice === 'organizer'}
              onPress={() => setChoice('organizer')}
            />

            {choice === 'organizer' && (
              <TextInput
                style={styles.reportInput}
                multiline
                value={memo}
                onChangeText={setMemo}
                placeholder="상황을 자세히 설명해주세요..."
                placeholderTextColor="#ADB5BD"
              />
            )}

            <TouchableOpacity
              activeOpacity={choice ? 0.86 : 1}
              style={[
                styles.sendButton,
                (!choice || isSending) && styles.sendButtonDisabled,
              ]}
              onPress={choice && !isSending ? submitReport : undefined}
            >
              <Ionicons
                name="paper-plane-outline"
                size={22}
                color="#fff"
              />

              <Text style={styles.sendText}>
                {choice === 'organizer'
                  ? '행사 주최자에게 상황 문자 보내기'
                  : '운영요원에게 상황 문자 보내기'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <PlaceSelectModal
        visible={placeSelectorOpen}
        zones={zones}
        onClose={() => setPlaceSelectorOpen(false)}
        onSelect={selectPlace}
      />
    </>
  );
}

function ReportOption({
  icon,
  title,
  subtitle,
  selected,
  hasChevron,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  selected: boolean;
  hasChevron?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[
        styles.reportOption,
        selected && styles.reportOptionSelected,
      ]}
    >
      <View
        style={[
          styles.reportOptionIcon,
          selected && styles.reportOptionIconSelected,
        ]}
      >
        <Ionicons
          name={icon}
          size={23}
          color={selected ? '#fff' : COLORS.muted}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.reportOptionTitle,
            selected && { color: COLORS.mint },
          ]}
        >
          {title}
        </Text>

        {!!subtitle && (
          <Text style={styles.reportOptionSubtitle}>{subtitle}</Text>
        )}
      </View>

      {selected ? (
        <Ionicons name="checkmark-circle" size={24} color={COLORS.mint} />
      ) : hasChevron ? (
        <Ionicons name="chevron-forward" size={24} color="#ADB5BD" />
      ) : null}
    </TouchableOpacity>
  );
}

function PlaceSelectModal({
  visible,
  zones,
  onClose,
  onSelect,
}: {
  visible: boolean;
  zones: CrowdZone[];
  onClose: () => void;
  onSelect: (zone: CrowdZone) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.placeSheet}>
          <View style={styles.sheetHandle} />

          <Text style={styles.placeTitle}>장소 선택</Text>
          <Text style={styles.placeSubtitle}>
            현재 위치 또는 원하는 장소를 선택하세요
          </Text>

          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={() => onSelect(zones[0])}
          >
            <Ionicons name="navigate-outline" size={22} color={COLORS.mint} />
            <Text style={styles.currentLocationText}>현재 위치로 설정</Text>
          </TouchableOpacity>

          <Text style={styles.placeGroupLabel}>구역 선택</Text>

          <View style={styles.placeList}>
            {zones.map((zone) => {
              const isSafe =
                zone.riskLevel === 'relaxed' ||
                zone.riskLevel === 'warning';

              return (
                <TouchableOpacity
                  key={zone.id}
                  activeOpacity={0.8}
                  style={styles.placeRow}
                  onPress={() => onSelect(zone)}
                >
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color="#ADB5BD"
                  />

                  <Text style={styles.placeRowText}>{zone.name}</Text>

                  <View
                    style={[
                      styles.placeBadge,
                      {
                        backgroundColor: isSafe ? '#F0FBF3' : '#FEF2F2',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.placeBadgeText,
                        {
                          color: isSafe ? '#4AAE65' : COLORS.danger,
                        },
                      ]}
                    >
                      {isSafe ? '안전' : '위험'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ZoneDetailModal({
  zone,
  onClose,
  onRefresh,
}: {
  zone: CrowdZone | null;
  onClose: () => void;
  onRefresh: () => void;
}) {
  if (!zone) return null;

  const isDanger = zone.riskLevel === 'danger';
  const riskColor = getRiskColor(zone.riskLevel);

  return (
    <Modal visible={!!zone} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.detailRoot} edges={['top', 'bottom']}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.detailIconButton}
            onPress={onClose}
          >
            <Ionicons name="arrow-back" size={25} color={COLORS.text} />
          </TouchableOpacity>

          <Text
            style={styles.detailHeaderTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
          >
            {zone.name} 상세정보
          </Text>

          <TouchableOpacity
            style={styles.detailIconButton}
            onPress={onRefresh}
          >
            <Ionicons name="refresh" size={28} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.detailScrollBody}
        >
          <View style={styles.livePreview}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.detailMetricsRow}>
            <View
              style={[
                styles.detailInfoCard,
                {
                  backgroundColor: isDanger ? '#FFF4F4' : '#FFF8E6',
                },
              ]}
            >
              <Text style={styles.detailInfoLabel}>혼잡도 단계</Text>
              <Text style={[styles.detailRiskText, { color: riskColor }]}>
                • {getRiskText(zone.riskLevel)}
              </Text>
            </View>

            <View
              style={[
                styles.detailInfoCard,
                {
                  backgroundColor: '#EAF8F5',
                },
              ]}
            >
              <Text style={styles.detailInfoLabel}>현재 인원</Text>
              <Text style={[styles.detailPeopleText, { color: COLORS.mint }]}>
                {zone.peopleCount}{' '}
                <Text style={styles.detailPeopleUnit}>명</Text>
              </Text>
              <Text style={styles.detailInfoTiny}>실시간 업데이트</Text>
            </View>
          </View>

          <View
            style={[
              styles.detailWarning,
              {
                backgroundColor: isDanger ? '#FFF4F4' : '#FFF8E6',
              },
            ]}
          >
            <Ionicons name="warning-outline" size={18} color={riskColor} />
            <Text style={[styles.detailWarningText, { color: riskColor }]}>
              {isDanger
                ? '위험 수준입니다. 해당 구역 접근을 자제하세요'
                : '주의가 필요합니다. 혼잡도를 확인하며 이동하세요'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },

  titleBlock: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    color: COLORS.text,
    fontWeight: '900',
    letterSpacing: 0,
  },

  subtitle: {
    color: COLORS.muted,
    marginTop: 8,
    fontWeight: '500',
  },

  reportButton: {
    borderWidth: 1.5,
    borderColor: '#EB7774',
    borderRadius: 15,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#fff',
    shadowColor: '#E46D6A',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 2,
  },

  reportText: {
    color: '#E46D6A',
    fontWeight: '900',
  },

  mapArea: {
    backgroundColor: COLORS.mapBg,
    overflow: 'hidden',
    position: 'relative',
  },

  mapWebView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.mapBg,
  },

  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.mapBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapLoadingText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '700',
  },

  markerLayer: {
    ...StyleSheet.absoluteFillObject,
  },

  markerWrap: {
    position: 'absolute',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    alignItems: 'center',
    justifyContent: 'center',
  },

  marker: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  markerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },

  mapControlGroup: {
    position: 'absolute',
    left: 22,
    bottom: 22,
    gap: 12,
  },

  mapControl: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#111827',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },

  densitySection: {
    backgroundColor: '#fff',
  },

  sectionTitle: {
    color: COLORS.text,
    fontWeight: '900',
    letterSpacing: 0,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  emptyState: {
    width: '100%',
    minHeight: 96,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: '#F8FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  emptyStateText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },

  densityCard: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 14,
  },

  zoneName: {
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 20,
  },

  people: {
    fontWeight: '900',
    marginTop: 10,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  reportSheet: {
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingTop: 26,
    overflow: 'hidden',
  },

  reportTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingHorizontal: 28,
    paddingBottom: 22,
  },

  reportIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D95A56',
  },

  reportTitle: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: '900',
    marginBottom: 8,
  },

  reportSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: '500',
  },

  reportDivider: {
    height: 1,
    backgroundColor: COLORS.line,
    marginBottom: 20,
  },

  reportOption: {
    minHeight: 86,
    marginHorizontal: 28,
    marginBottom: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },

  reportOptionSelected: {
    borderColor: COLORS.mint,
    backgroundColor: '#F0F8FF',
  },

  reportOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F8FA',
  },

  reportOptionIconSelected: {
    backgroundColor: COLORS.mint,
  },

  reportOptionTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '900',
  },

  reportOptionSubtitle: {
    fontSize: 14,
    color: COLORS.mint,
    fontWeight: '800',
    marginTop: 5,
  },

  reportInput: {
    minHeight: 104,
    marginHorizontal: 28,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 13,
    padding: 16,
    color: COLORS.text,
    textAlignVertical: 'top',
    fontSize: 15,
  },

  sendButton: {
    height: 64,
    marginHorizontal: 28,
    marginTop: 8,
    marginBottom: 30,
    borderRadius: 14,
    backgroundColor: '#E26662',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    shadowColor: '#D94C48',
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 3,
  },

  sendButtonDisabled: {
    backgroundColor: '#F1F3F6',
    shadowOpacity: 0,
  },

  sendText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
  },

  placeSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 28,
    marginTop: 'auto',
  },

  sheetHandle: {
    width: 52,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DFE3E8',
    alignSelf: 'center',
    marginBottom: 28,
  },

  placeTitle: {
    fontSize: 21,
    color: COLORS.text,
    fontWeight: '900',
    marginBottom: 18,
  },

  placeSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 24,
  },

  currentLocationButton: {
    height: 66,
    borderRadius: 10,
    backgroundColor: '#EFFBF8',
    borderWidth: 1,
    borderColor: '#CBEDEA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    marginBottom: 28,
  },

  currentLocationText: {
    fontSize: 17,
    color: COLORS.mint,
    fontWeight: '900',
  },

  placeGroupLabel: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 18,
  },

  placeList: {
    borderWidth: 1,
    borderColor: '#F0F2F4',
    borderRadius: 12,
    overflow: 'hidden',
  },

  placeRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F4',
  },

  placeRowText: {
    flex: 1,
    fontSize: 17,
    color: COLORS.text,
    fontWeight: '900',
  },

  placeBadge: {
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },

  placeBadgeText: {
    fontSize: 14,
    fontWeight: '900',
  },

  detailRoot: {
    flex: 1,
    backgroundColor: '#fff',
  },

  detailHeader: {
    height: 88,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 12,
  },

  detailIconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
  },

  detailScrollBody: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 48,
  },

  livePreview: {
    width: '100%',
    height: 246,
    borderRadius: 18,
    backgroundColor: '#19182B',
    padding: 16,
  },

  liveBadge: {
    alignSelf: 'flex-start',
    height: 20,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#11111C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },

  liveText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: '900',
  },

  detailMetricsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 18,
  },

  detailInfoCard: {
    flex: 1,
    minHeight: 122,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'center',
  },

  detailInfoLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 8,
  },

  detailRiskText: {
    fontSize: 22,
    fontWeight: '900',
  },

  detailPeopleText: {
    fontSize: 24,
    fontWeight: '900',
  },

  detailPeopleUnit: {
    color: '#566173',
    fontSize: 13,
  },

  detailInfoTiny: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 8,
  },

  detailWarning: {
    minHeight: 66,
    borderRadius: 14,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  detailWarningText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
});
