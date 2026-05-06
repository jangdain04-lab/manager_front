import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TEAL = '#55CCC4';
const DARK = '#111827';
const PLACE_COUNT = 10;

function Progress({ step }: { step: number }) {
  return (
    <View style={styles.progressRow}>
      {[1, 2, 3, 4].map(i => (
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

function MapImage({ count = 0 }: { count?: number }) {
  const markerPositions = [
    { left: '15%', top: '18%' },
    { left: '42%', top: '10%' },
    { left: '78%', top: '18%' },
    { left: '28%', top: '43%' },
    { left: '55%', top: '36%' },
    { left: '86%', top: '52%' },
    { left: '13%', top: '65%' },
    { left: '47%', top: '65%' },
    { left: '76%', top: '76%' },
    { left: '30%', top: '86%' },
  ];

  return (
    <ImageBackground
      source={require('../../../assets/campus-map.png')}
      style={styles.map}
      imageStyle={styles.mapImage}
      resizeMode="cover"
    >
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.marker,
            markerPositions[index % markerPositions.length] as any,
          ]}
        >
          <Text style={styles.markerText}>{index + 1}</Text>
        </View>
      ))}
    </ImageBackground>
  );
}

export default function OnboardingFlow({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const goNext = () => {
    if (step < 4) {
      setStep(step + 1);
      setSelectedNumber(1);
    } else {
      setStep(5);
    }
  };

  const goPrev = () => {
    if (step > 1) {
      setStep(step - 1);
      setSelectedNumber(1);
    }
  };

  if (step === 5) {
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
      <Progress step={step} />

      <Text style={styles.title}>
        {step === 1 && 'STEP 1. 행사의 장소 범위를 등록해주세요.'}
        {step === 2 && 'STEP 2. 행사장의 모든 CCTV 위치를 등록해주세요.'}
        {step === 3 && 'STEP 3. 각 CCTV 별 장소 이름을 등록해주세요.'}
        {step === 4 && 'STEP 4. 각 장소의 각도를 입력해주세요.'}
      </Text>

      {step === 1 && (
        <>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="장소를 검색하세요"
              placeholderTextColor="#8B95A1"
            />
            <Ionicons name="search-outline" size={28} color="#8B95A1" />
          </View>

          <MapImage />

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
            <Ionicons name="search-outline" size={28} color="#8B95A1" />
          </View>

          <MapImage count={PLACE_COUNT} />

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

          <MapImage count={PLACE_COUNT} />

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

          <MapImage count={PLACE_COUNT} />

          <TouchableOpacity onPress={() => setShowSkipModal(true)}>
            <Text style={styles.skipText}>건너뛰기</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.grayButton} onPress={goPrev}>
              <Text style={styles.grayBtnText}>이전</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.halfButton} onPress={() => setStep(5)}>
              <Text style={styles.primaryBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal visible={showSkipModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay}>
          <View style={styles.warningModal}>
            <Text style={styles.warningTitle}>주의</Text>

            <Text style={styles.warningText}>
              각도를 입력하지 않으면 추후{'\n'}
              위험도 계산에 지장이 생겨요!{'\n'}
              나중에라도 꼭 입력해주세요.
            </Text>

            <TouchableOpacity
              style={styles.warningButton}
              onPress={() => {
                setShowSkipModal(false);
                setStep(5);
              }}
            >
              <Text style={styles.primaryBtnText}>다음</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 58,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 36,
    marginBottom: 34,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: '900',
    color: DARK,
    paddingHorizontal: 36,
    marginBottom: 26,
  },
  searchBox: {
    marginHorizontal: 36,
    height: 58,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: DARK,
    fontWeight: '600',
  },
  map: {
    flex: 1,
    backgroundColor: '#DDEAF7',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    fontSize: 17,
    fontWeight: '900',
    color: DARK,
  },
  bottomBar: {
    paddingHorizontal: 36,
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
  },
  fullButton: {
    height: 64,
    borderRadius: 10,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 18,
    paddingHorizontal: 36,
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
  },
  halfButton: {
    flex: 1,
    height: 64,
    borderRadius: 10,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grayButton: {
    flex: 1,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grayBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: DARK,
  },
  primaryBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  numberWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    paddingHorizontal: 36,
    marginBottom: 22,
  },
  numberBtn: {
    width: '17%',
    height: 54,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBtnActive: {
    backgroundColor: TEAL,
  },
  numberText: {
    fontSize: 18,
    fontWeight: '900',
    color: DARK,
  },
  numberTextActive: {
    color: '#FFFFFF',
  },
  largeInput: {
    marginHorizontal: 36,
    height: 62,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    paddingHorizontal: 18,
    fontSize: 18,
    fontWeight: '800',
    color: DARK,
    marginBottom: 28,
  },
  skipText: {
    textAlign: 'center',
    color: '#8B95A1',
    fontSize: 16,
    fontWeight: '700',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  warningModal: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 30,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: DARK,
    marginBottom: 28,
  },
  warningText: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 32,
    color: DARK,
    marginBottom: 30,
  },
  warningButton: {
    width: '100%',
    height: 58,
    borderRadius: 10,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  completeTitle: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '900',
    color: DARK,
    lineHeight: 42,
    marginBottom: 40,
  },
  completeAccent: {
    color: TEAL,
  },
  completeSub: {
    textAlign: 'center',
    fontSize: 21,
    fontWeight: '900',
    color: DARK,
    lineHeight: 34,
    marginBottom: 74,
  },
  completeButton: {
    height: 64,
    borderRadius: 10,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
});