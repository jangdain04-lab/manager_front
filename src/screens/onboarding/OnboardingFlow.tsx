import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { scale, verticalScale, moderateScale } from '../../utils/scale';

const TEAL = '#55CCC4';
const DARK = '#111827';
const PLACE_COUNT = 10;
const MAP_URL = 'https://generous-maternity-smugness.ngrok-free.dev/map.html';

function Progress({ step }: { step: number }) {
  return (
    <View style={styles.progressRow}>
      {[1, 2, 3, 4, 5].map((i) => (
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

function MapViewBox() {
  return (
    <View style={styles.mapBox}>
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
      <View style={styles.completeContainer}>
        <Text style={styles.completeTitle}>
          <Text style={styles.completeAccent}>초기 정보 입력</Text>이{'\n'}
          모두 끝났습니다!
        </Text>

        <Text style={styles.completeSub}>
          본격적으로 행사 관리를{'\n'}시작해볼까요?
        </Text>

        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.primaryBtnText}>다음</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
                placeholder="장소를 검색하세요"
                placeholderTextColor="#8B95A1"
              />
              <Ionicons
                name="search-outline"
                size={moderateScale(26)}
                color="#8B95A1"
              />
            </View>

            <MapViewBox />

            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.fullButton} onPress={goNext}>
                <Text style={styles.primaryBtnText}>확인</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.searchInput}
                placeholder="장소를 검색하세요"
                placeholderTextColor="#8B95A1"
              />
              <Ionicons
                name="search-outline"
                size={moderateScale(26)}
                color="#8B95A1"
              />
            </View>

            <MapViewBox />

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
              value={`${selectedNumber}번 장소`}
              onChangeText={() => {}}
            />

            <MapViewBox />

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
              placeholder="각도를 입력하세요 (예: 90°)"
              placeholderTextColor="#8B95A1"
            />

            <MapViewBox />

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
              placeholder="면적을 입력하세요 (예: 120㎡)"
              placeholderTextColor="#8B95A1"
              keyboardType="numeric"
            />

            <MapViewBox />

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
      </ScrollView>

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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(54),
    paddingBottom: verticalScale(24),
  },

  progressRow: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(26),
  },

  progressBar: {
    flex: 1,
    height: verticalScale(8),
    borderRadius: scale(999),
  },

  title: {
    fontSize: moderateScale(24),
    fontWeight: '900',
    color: DARK,
    lineHeight: moderateScale(32),
    letterSpacing: -0.8,
    marginBottom: verticalScale(18),
  },

  searchBox: {
    height: verticalScale(58),
    borderRadius: scale(18),
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: scale(18),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },

  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: DARK,
  },

  mapBox: {
    height: verticalScale(350),
    minHeight: verticalScale(280),
    borderRadius: scale(26),
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: verticalScale(18),
  },

  map: {
    flex: 1,
  },

  numberWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: verticalScale(14),
  },

  numberBtn: {
    width: '18%',
    height: verticalScale(44),
    borderRadius: scale(15),
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
    fontSize: moderateScale(14),
    fontWeight: '900',
    color: '#8B95A1',
  },

  numberTextActive: {
    color: '#FFFFFF',
  },

  largeInput: {
    height: verticalScale(58),
    borderRadius: scale(18),
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: scale(18),
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: DARK,
    marginBottom: verticalScale(14),
  },

  skipText: {
    textAlign: 'center',
    color: '#8B95A1',
    fontSize: moderateScale(15),
    fontWeight: '800',
    marginBottom: verticalScale(14),
  },

  bottomBar: {
    paddingBottom: verticalScale(8),
  },

  buttonRow: {
    flexDirection: 'row',
    gap: scale(12),
    paddingBottom: verticalScale(8),
  },

  fullButton: {
    height: verticalScale(58),
    borderRadius: scale(18),
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  halfButton: {
    flex: 1,
    height: verticalScale(58),
    borderRadius: scale(18),
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  grayButton: {
    flex: 1,
    height: verticalScale(58),
    borderRadius: scale(18),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: moderateScale(17),
    fontWeight: '900',
  },

  grayBtnText: {
    color: DARK,
    fontSize: moderateScale(17),
    fontWeight: '900',
  },

  completeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(28),
  },

  completeTitle: {
    fontSize: moderateScale(31),
    fontWeight: '900',
    color: DARK,
    textAlign: 'center',
    lineHeight: moderateScale(42),
    letterSpacing: -1,
    marginBottom: verticalScale(22),
  },

  completeAccent: {
    color: TEAL,
  },

  completeSub: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#8B95A1',
    textAlign: 'center',
    lineHeight: moderateScale(28),
    marginBottom: verticalScale(42),
  },

  completeButton: {
    width: '100%',
    height: verticalScale(60),
    borderRadius: scale(18),
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(28),
  },

  modalBox: {
    width: '100%',
    borderRadius: scale(24),
    backgroundColor: '#FFFFFF',
    padding: scale(24),
  },

  modalTitle: {
    fontSize: moderateScale(21),
    fontWeight: '900',
    color: DARK,
    marginBottom: verticalScale(10),
  },

  modalText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#8B95A1',
    lineHeight: moderateScale(23),
    marginBottom: verticalScale(22),
  },

  modalButtonRow: {
    flexDirection: 'row',
    gap: scale(12),
  },

  modalCancel: {
    flex: 1,
    height: verticalScale(52),
    borderRadius: scale(16),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCancelText: {
    fontSize: moderateScale(15),
    fontWeight: '900',
    color: DARK,
  },

  modalConfirm: {
    flex: 1,
    height: verticalScale(52),
    borderRadius: scale(16),
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalConfirmText: {
    fontSize: moderateScale(15),
    fontWeight: '900',
    color: '#FFFFFF',
  },
});