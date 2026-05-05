import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: any) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const goNext = () => navigation.replace('Onboarding');

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Ionicons name="shield-checkmark-outline" size={86} color="#15AFA4" />
        <Ionicons name="add" size={28} color="#15AFA4" style={styles.plus} />
      </View>

      <Text style={styles.slogan}>
        모두의 <Text style={styles.accent}>안전한</Text> 길을 만들다.
      </Text>

      <TouchableOpacity style={styles.emailBtn} onPress={goNext}>
        <Text style={styles.emailBtnText}>이메일로 가입하기</Text>
      </TouchableOpacity>

      <View style={styles.socialRow}>
        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#FEE500' }]} onPress={goNext}>
          <Text style={styles.kakao}>●</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#03C75A' }]} onPress={goNext}>
          <Text style={styles.naver}>N</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialBtn, styles.googleBtn]} onPress={goNext}>
          <Text style={styles.google}>G</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setInviteOpen(true)}>
        <Text style={styles.inviteText}>초대코드를 받으셨나요?</Text>
      </TouchableOpacity>

      <Modal visible={inviteOpen} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setInviteOpen(false)}>
          <Pressable style={styles.modalCard}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setInviteOpen(false)}>
              <Ionicons name="close" size={28} color="#9CA3AF" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>초대코드 입력</Text>
            <Text style={styles.modalDesc}>총 관리자에게 받은{'\n'}초대 코드를 입력해주세요</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="초대코드 입력"
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setInviteOpen(false);
                goNext();
              }}
            >
              <Text style={styles.modalButtonText}>초대 코드 확인</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 48,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 138,
    height: 138,
    borderRadius: 38,
    backgroundColor: '#061728',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 38,
  },
  plus: {
    position: 'absolute',
    right: 28,
    top: 38,
  },
  slogan: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 92,
  },
  accent: {
    color: '#55CCC4',
  },
  emailBtn: {
    width: '100%',
    height: 58,
    borderRadius: 10,
    backgroundColor: '#55CCC4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  emailBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 22,
    marginBottom: 38,
  },
  socialBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakao: {
    fontSize: 26,
    color: '#3A1D1D',
  },
  naver: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  google: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4285F4',
  },
  inviteText: {
    color: '#8B95A1',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 42,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 28,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 30,
  },
  modalDesc: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 30,
    color: '#111827',
    marginBottom: 26,
  },
  modalInput: {
    height: 58,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 24,
  },
  modalButton: {
    height: 58,
    borderRadius: 10,
    backgroundColor: '#55CCC4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});