import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventSettings, saveOnboardingSettings } from '../../services/api';

const TEAL = '#55CCC4';
const DARK = '#111827';
const PLACE_COUNT = 10;
const MAP_URL = 'https://generous-maternity-smugness.ngrok-free.dev/map.html';

const createInitialPlaceInfo = (): EventSettings => ({
  eventRange: '',
  searchPlace: '',
  placeDisplayName: '',
  cctvLocations: Array.from({ length: PLACE_COUNT }, (_, index) => `${index + 1}번 CCTV`),
  placeNames: Array.from({ length: PLACE_COUNT }, (_, index) => `${index + 1}번 장소`),
  roadAngles: Array.from({ length: PLACE_COUNT }, () => ''),
  roadAreas: Array.from({ length: PLACE_COUNT }, () => ''),
});

function Progress({ step }: { step: number }) {
  return (
    <View style={styles.progressRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <View
          key={i}
          style={[
            styles.progressBar,
            { backgroundColor: i <= step ? DARK : '#CFEFEB' },
          ]}
        />
      ))}
    </View>
  );
}

function NumberTabs({
  count,
  selected,
  onSelect,
}: {
  count: number;
  selected: number;
  onSelect: (n: number) => void;
}) {
  return (
    <View style={styles.numberWrap}>
      {Array.from({ length: count }).map((_, i) => {
        const n = i + 1;
        const active = selected === n;

        return (
          <TouchableOpacity
            key={n}
            style={[styles.numberBtn, active && styles.numberBtnActive]}
            onPress={() => onSelect(n)}
          >
            <Text style={[styles.numberText, active && styles.numberTextActive]}>
              {n}번
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MapViewBox({ height }: { height: number }) {
  return (
    <View style={[styles.mapBox, { height }]}>
      <WebView
        source={{ uri: MAP_URL }}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
        geolocationEnabled
        originWhitelist={['*']}
        mixedContentMode="always"
      />
    </View>
  );
}

export default function OnboardingFlow({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [placeInfo, setPlaceInfo] = useState<EventSettings>(createInitialPlaceInfo);
  const [saving, setSaving] = useState(false);
  const { height } = useWindowDimensions();
  const mapHeight = Math.max(220, Math.min(360, height * 0.38));
  const selectedIndex = selectedNumber - 1;

  const updateArrayValue = (
    key: 'cctvLocations' | 'placeNames' | 'roadAngles' | 'roadAreas',
    value: string,
  ) => {
    setPlaceInfo((prev) => {
      const updated = [...prev[key]];
      updated[selectedIndex] = value;

      return {
        ...prev,
        [key]: updated,
      };
    });
  };

  const finishOnboarding = async () => {
    try {
      setSaving(true);
      await saveOnboardingSettings({
        ...placeInfo,
        placeDisplayName: placeInfo.placeDisplayName || placeInfo.searchPlace,
        eventRange: placeInfo.eventRange || placeInfo.searchPlace,
      });
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('저장 실패', '초기 설정을 저장하지 못했습니다. 백엔드 서버 연결을 확인해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const goNext = () => {
    if (step < 5) {
      setStep(step + 1);
      setSelectedNumber(1);
    } else {
      setStep(6);
    }
  };

  const goPrev = () => {
    if (step > 1) {
      setStep(step - 1);
      setSelectedNumber(1);
    }
  };

  if (step === 6) {
    return (
      <SafeAreaView style={styles.completeSafeArea}>
        <ScrollView
          contentContainerStyle={styles.completeContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.completeTitle}>
            <Text style={styles.completeAccent}>초기 정보 입력</Text>이{'\n'}
            모두 끝났습니다!
          </Text>

          <Text style={styles.completeSub}>
            본격적으로 행사 관리를{'\n'}시작해볼까요?
          </Text>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={finishOnboarding}
            disabled={saving}
          >
            <Text style={styles.primaryBtnText}>{saving ? '저장 중...' : '다음'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Progress step={step} />

          <Text style={styles.title}>
            {step === 1 && 'STEP 1. 행사의 장소 범위를 등록해주세요.'}
            {step === 2 && 'STEP 2. 행사장의 모든 CCTV 위치를 등록해주세요.'}
            {step === 3 && 'STEP 3. 각 CCTV 별 장소 이름을 등록해주세요.'}
            {step === 4 && 'STEP 4. 각 장소의 각도를 입력해주세요.'}
            {step === 5 && 'STEP 5. 각 길의 면적을 입력해주세요.'}
          </Text>

          {step === 1 && (
            <>
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput}
                  value={placeInfo.searchPlace}
                  onChangeText={(text) =>
                    setPlaceInfo((prev) => ({
                      ...prev,
                      searchPlace: text,
                      placeDisplayName: prev.placeDisplayName || text,
                    }))
                  }
                  placeholder="장소를 검색하세요"
                  placeholderTextColor="#8B95A1"
                />
                <Ionicons name="search-outline" size={28} color="#8B95A1" />
              </View>

              <MapViewBox height={mapHeight} />

              <TextInput
                style={styles.largeInput}
                value={placeInfo.eventRange}
                onChangeText={(text) =>
                  setPlaceInfo((prev) => ({
                    ...prev,
                    eventRange: text,
                  }))
                }
                placeholder="행사 장소 범위를 입력하세요"
                placeholderTextColor="#8B95A1"
              />

              <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.fullButton} onPress={goNext}>
                  <Text style={styles.primaryBtnText}>확인</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <NumberTabs
                count={PLACE_COUNT}
                selected={selectedNumber}
                onSelect={setSelectedNumber}
              />

              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput}
                  value={placeInfo.cctvLocations[selectedIndex]}
                  onChangeText={(text) => updateArrayValue('cctvLocations', text)}
                  placeholder="CCTV 이름 또는 위치를 입력하세요"
                  placeholderTextColor="#8B95A1"
                />
                <Ionicons name="search-outline" size={28} color="#8B95A1" />
              </View>

              <MapViewBox height={mapHeight} />

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.grayButton} onPress={goPrev}>
                  <Text style={styles.grayBtnText}>이전</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.halfButton} onPress={goNext}>
                  <Text style={styles.primaryBtnText}>확인</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <NumberTabs
                count={PLACE_COUNT}
                selected={selectedNumber}
                onSelect={setSelectedNumber}
              />

              <TextInput
                style={styles.largeInput}
                value={placeInfo.placeNames[selectedIndex]}
                onChangeText={(text) => updateArrayValue('placeNames', text)}
              />

              <MapViewBox height={mapHeight} />

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.grayButton} onPress={goPrev}>
                  <Text style={styles.grayBtnText}>이전</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.halfButton} onPress={goNext}>
                  <Text style={styles.primaryBtnText}>확인</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 4 && (
            <>
              <NumberTabs
                count={PLACE_COUNT}
                selected={selectedNumber}
                onSelect={setSelectedNumber}
              />

              <TextInput
                style={styles.largeInput}
                value={placeInfo.roadAngles[selectedIndex]}
                onChangeText={(text) => updateArrayValue('roadAngles', text)}
                placeholder="각도를 입력하세요 (예: 90°)"
                placeholderTextColor="#8B95A1"
              />

              <MapViewBox height={mapHeight} />

              <TouchableOpacity onPress={() => setShowSkipModal(true)}>
                <Text style={styles.skipText}>건너뛰기</Text>
              </TouchableOpacity>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.grayButton} onPress={goPrev}>
                  <Text style={styles.grayBtnText}>이전</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.halfButton} onPress={goNext}>
                  <Text style={styles.primaryBtnText}>확인</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 5 && (
            <>
              <NumberTabs
                count={PLACE_COUNT}
                selected={selectedNumber}
                onSelect={setSelectedNumber}
              />

              <TextInput
                style={styles.largeInput}
                value={placeInfo.roadAreas[selectedIndex]}
                onChangeText={(text) => updateArrayValue('roadAreas', text)}
                placeholder="면적을 입력하세요 (예: 120㎡)"
                placeholderTextColor="#8B95A1"
                keyboardType="numeric"
              />

              <MapViewBox height={mapHeight} />

              <TouchableOpacity onPress={() => setShowSkipModal(true)}>
                <Text style={styles.skipText}>건너뛰기</Text>
              </TouchableOpacity>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.grayButton} onPress={goPrev}>
                  <Text style={styles.grayBtnText}>이전</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.halfButton} onPress={goNext}>
                  <Text style={styles.primaryBtnText}>확인</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <Modal transparent visible={showSkipModal} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>입력을 건너뛸까요?</Text>
                <Text style={styles.modalText}>
                  해당 정보는 나중에 관리자 설정에서 다시 입력할 수 있습니다.
                </Text>

                <View style={styles.modalButtonRow}>
                  <Pressable
                    style={styles.modalCancel}
                    onPress={() => setShowSkipModal(false)}
                  >
                    <Text style={styles.modalCancelText}>취소</Text>
                  </Pressable>

                  <Pressable
                    style={styles.modalConfirm}
                    onPress={() => {
                      setShowSkipModal(false);
                      goNext();
                    }}
                  >
                    <Text style={styles.modalConfirmText}>건너뛰기</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  keyboardArea: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },

  progressRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 34,
  },

  progressBar: {
    flex: 1,
    height: 9,
    borderRadius: 999,
  },

  title: {
    fontSize: 25,
    fontWeight: '900',
    color: DARK,
    lineHeight: 34,
    letterSpacing: -0.8,
    marginBottom: 24,
  },

  searchBox: {
    height: 62,
    borderRadius: 18,
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: DARK,
  },

  mapBox: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 22,
  },

  map: {
    flex: 1,
  },

  numberWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },

  numberBtn: {
    width: '18%',
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F4F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  numberBtnActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },

  numberText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#8B95A1',
  },

  numberTextActive: {
    color: '#FFFFFF',
  },

  largeInput: {
    height: 62,
    borderRadius: 18,
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 18,
    fontSize: 17,
    fontWeight: '800',
    color: DARK,
    marginBottom: 18,
  },

  skipText: {
    textAlign: 'center',
    color: '#8B95A1',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },

  bottomBar: {
    paddingBottom: 12,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 12,
  },

  fullButton: {
    height: 62,
    borderRadius: 18,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  halfButton: {
    flex: 1,
    height: 62,
    borderRadius: 18,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  grayButton: {
    flex: 1,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  grayBtnText: {
    color: DARK,
    fontSize: 18,
    fontWeight: '900',
  },

  completeSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  completeContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 24,
  },

  completeTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: DARK,
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -1,
    marginBottom: 24,
  },

  completeAccent: {
    color: TEAL,
  },

  completeSub: {
    fontSize: 19,
    fontWeight: '700',
    color: '#8B95A1',
    textAlign: 'center',
    lineHeight: 29,
    marginBottom: 46,
  },

  completeButton: {
    width: '100%',
    height: 64,
    borderRadius: 18,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  modalBox: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: DARK,
    marginBottom: 10,
  },

  modalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B95A1',
    lineHeight: 24,
    marginBottom: 24,
  },

  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },

  modalCancel: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCancelText: {
    fontSize: 16,
    fontWeight: '900',
    color: DARK,
  },

  modalConfirm: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalConfirmText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
