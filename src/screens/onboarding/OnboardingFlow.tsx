import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  Modal,
} from 'react-native';

export default function OnboardingFlow({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [placeCount, setPlaceCount] = useState(3);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const numbers = Array.from({ length: placeCount }, (_, i) => i + 1);

  const next = () => {
    if (step < 4) setStep(step + 1);
    else setStep(5);
  };

  const prev = () => setStep(step - 1);

  // STEP 5 → 메인 앱
  if (step === 5) {
    return (
      <View style={styles.container}>
        <Text style={styles.completeTitle}>
          초기 정보 입력이 모두 끝났습니다!
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 progress */}
      <View style={styles.progressRow}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.progressBar,
              { backgroundColor: i <= step ? '#2EC4B6' : '#ccc' },
            ]}
          />
        ))}
      </View>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <Text style={styles.title}>STEP 1. 장소 개수를 입력해주세요</Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="장소 개수 입력"
            onChangeText={(v) => setPlaceCount(Number(v) || 1)}
          />

          <Image
            source={require('../../../assets/campus-map.png')}
            style={styles.map}
          />

          <TouchableOpacity style={styles.button} onPress={next}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <Text style={styles.title}>STEP 2. CCTV 위치</Text>

          <ImageBackground
            source={require('../../../assets/campus-map.png')}
            style={styles.map}
          >
            {numbers.map((n) => (
              <View key={n} style={styles.marker}>
                <Text>{n}</Text>
              </View>
            ))}
          </ImageBackground>

          <View style={styles.row}>
            <TouchableOpacity style={styles.grayBtn} onPress={prev}>
              <Text>이전</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={next}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <Text style={styles.title}>STEP 3. 장소 이름 입력</Text>

          <View style={styles.grid}>
            {numbers.map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setSelectedIndex(n)}
                style={[
                  styles.numBtn,
                  selectedIndex === n && { backgroundColor: '#2EC4B6' },
                ]}
              >
                <Text>{n}번</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput style={styles.input} placeholder="장소 이름 입력" />

          <View style={styles.row}>
            <TouchableOpacity style={styles.grayBtn} onPress={prev}>
              <Text>이전</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={next}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <>
          <Text style={styles.title}>STEP 4. 각도 입력</Text>

          <View style={styles.grid}>
            {numbers.map((n) => (
              <TouchableOpacity
                key={n}
                onPress={() => setSelectedIndex(n)}
                style={[
                  styles.numBtn,
                  selectedIndex === n && { backgroundColor: '#2EC4B6' },
                ]}
              >
                <Text>{n}번</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput style={styles.input} placeholder="각도 입력 (예: 90)" />

          <TouchableOpacity onPress={() => setShowSkipModal(true)}>
            <Text style={{ marginBottom: 10 }}>건너뛰기</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity style={styles.grayBtn} onPress={prev}>
              <Text>이전</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={next}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* 건너뛰기 팝업 */}
      <Modal visible={showSkipModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>주의</Text>
            <Text>각도를 입력하지 않으면 정확도가 떨어집니다</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setShowSkipModal(false);
                next();
              }}
            >
              <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}