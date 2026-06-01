import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Colors } from '../../components/Colors';
import { DEMO_MAP_URL, DEMO_PLACES } from '../../data/demoData';

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function Settings() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [liveDataEnabled, setLiveDataEnabled] = useState(true);
  const [placeSettingVisible, setPlaceSettingVisible] = useState(false);

  if (placeSettingVisible) {
    return (
      <View style={styles.screen}>
        <View style={styles.subHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setPlaceSettingVisible(false)}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.subHeaderTitle}>모니터링 구역 설정</Text>
            <Text style={styles.subHeaderDescription}>CCTV 4개 구역 연결 상태</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.placeContent} showsVerticalScrollIndicator={false}>
          <View style={styles.editCard}>
            <View style={styles.cardTitleRow}>
              <View style={styles.blueIcon}>
                <Ionicons name="map" size={19} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.editTitle}>실시간 지도 연결</Text>
                <Text style={styles.editDescription}>현장 혼잡도 지도가 정상적으로 연결되어 있습니다.</Text>
              </View>
            </View>
            <View style={styles.mapBox}>
              <WebView
                source={{ uri: DEMO_MAP_URL }}
                style={styles.webview}
                startInLoadingState
                javaScriptEnabled
                domStorageEnabled
              />
            </View>
          </View>

          <View style={styles.editCard}>
            <View style={styles.cardTitleRow}>
              <View style={styles.blueIcon}>
                <Ionicons name="videocam" size={19} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.editTitle}>고정 CCTV 구역</Text>
                <Text style={styles.editDescription}>행사 운영 중 사용할 모니터링 구역입니다.</Text>
              </View>
            </View>
            <View style={styles.zoneList}>
              {DEMO_PLACES.map((place, index) => (
                <View
                  key={place.id}
                  style={[styles.zoneRow, index < DEMO_PLACES.length - 1 && styles.rowBorder]}
                >
                  <View style={styles.zoneNumber}>
                    <Text style={styles.zoneNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.zoneText}>
                    <Text style={styles.zoneName}>{place.name}</Text>
                    <Text style={styles.zoneCamera}>{place.camera} · 연결됨</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              Alert.alert('저장 완료', '모니터링 구역 설정이 저장되었습니다.');
              setPlaceSettingVisible(false);
            }}
          >
            <Text style={styles.saveButtonText}>저장하기</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>설정</Text>
          <Text style={styles.headerDescription}>앱 환경 설정</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={30} color={Colors.primary} />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>주최자</Text>
            <Text style={styles.profileEmail}>organizer@event.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </View>

        <SectionTitle label="행사 설정" />
        <View style={styles.sectionCard}>
          <LinkRow
            icon="location"
            label="모니터링 구역 설정"
            description="등록된 CCTV 4개 구역을 확인합니다"
            onPress={() => setPlaceSettingVisible(true)}
          />
          <ToggleRow
            icon="sync"
            label="실시간 데이터 수신"
            value={liveDataEnabled}
            onChange={setLiveDataEnabled}
            isLast
          />
        </View>

        <SectionTitle label="알림 설정" />
        <View style={styles.sectionCard}>
          <ToggleRow
            icon="notifications"
            label="푸시 알림"
            value={notificationsEnabled}
            onChange={setNotificationsEnabled}
          />
          <ToggleRow
            icon="volume-high"
            label="알림음"
            value={soundEnabled}
            onChange={setSoundEnabled}
            isLast
          />
        </View>

        <SectionTitle label="표시 설정" />
        <View style={styles.sectionCard}>
          <ToggleRow
            icon="moon"
            label="다크 모드"
            value={darkModeEnabled}
            onChange={setDarkModeEnabled}
            isLast
          />
        </View>

        <SectionTitle label="계정" />
        <View style={styles.sectionCard}>
          <LinkRow
            icon="person-circle"
            label="프로필 설정"
            onPress={() => Alert.alert('프로필 설정', '프로필 정보가 최신 상태입니다.')}
          />
          <LinkRow
            icon="lock-closed"
            label="보안 설정"
            onPress={() => Alert.alert('보안 설정', '보안 설정이 정상적으로 적용되어 있습니다.')}
            isLast
          />
        </View>

        <SectionTitle label="앱 정보" />
        <View style={styles.sectionCard}>
          <InfoRow icon="information-circle" label="버전 정보" value="1.0.0" />
          <LinkRow
            icon="document-text"
            label="개인정보 처리방침"
            onPress={() => Alert.alert('개인정보 처리방침', 'SAFE PATH 개인정보 처리방침입니다.')}
            isLast
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => Alert.alert('로그아웃', '현재 계정에서 로그아웃하시겠습니까?', [
            { text: '취소', style: 'cancel' },
            { text: '로그아웃', style: 'destructive' },
          ])}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <Text style={styles.sectionTitle}>{label}</Text>;
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
  isLast = false,
}: {
  icon: IoniconName;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.settingRow, !isLast && styles.rowBorder]}>
      <RowLabel icon={icon} label={label} />
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={Colors.white}
      />
    </View>
  );
}

function LinkRow({
  icon,
  label,
  description,
  onPress,
  isLast = false,
}: {
  icon: IoniconName;
  label: string;
  description?: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.settingRow, !isLast && styles.rowBorder]} onPress={onPress}>
      <RowLabel icon={icon} label={label} description={description} />
      <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

function InfoRow({ icon, label, value }: { icon: IoniconName; label: string; value: string }) {
  return (
    <View style={[styles.settingRow, styles.rowBorder]}>
      <RowLabel icon={icon} label={label} />
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function RowLabel({
  icon,
  label,
  description,
}: {
  icon: IoniconName;
  label: string;
  description?: string;
}) {
  return (
    <View style={styles.settingLeft}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={19} color={Colors.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description ? <Text style={styles.settingDescription}>{description}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 18,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 18,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: { color: Colors.text, fontSize: 25, fontWeight: '800' },
  headerDescription: { color: Colors.textSecondary, fontSize: 13, marginTop: 3 },
  subHeaderTitle: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  subHeaderDescription: { color: Colors.textSecondary, fontSize: 13, marginTop: 3 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 18,
    marginBottom: 26,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
  },
  profileText: { flex: 1, marginLeft: 14 },
  profileName: { color: Colors.text, fontSize: 18, fontWeight: '800' },
  profileEmail: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
    marginBottom: 9,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  settingRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 12 },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    marginRight: 12,
  },
  rowText: { flex: 1 },
  settingLabel: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  settingDescription: { color: Colors.textSecondary, fontSize: 12, marginTop: 4 },
  infoValue: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
  logoutButton: {
    height: 54,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dangerLight,
    gap: 7,
    marginBottom: 8,
  },
  logoutText: { color: Colors.danger, fontSize: 15, fontWeight: '800' },
  placeContent: { padding: 20, paddingBottom: 50 },
  editCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  blueIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    marginRight: 11,
  },
  editTitle: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  editDescription: { color: Colors.textSecondary, fontSize: 12, marginTop: 4 },
  mapBox: {
    height: 260,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  webview: { flex: 1 },
  zoneList: { overflow: 'hidden', borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  zoneRow: { minHeight: 70, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 },
  zoneNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    marginRight: 11,
  },
  zoneNumberText: { color: Colors.primary, fontSize: 13, fontWeight: '800' },
  zoneText: { flex: 1 },
  zoneName: { color: Colors.text, fontSize: 15, fontWeight: '800' },
  zoneCamera: { color: Colors.textSecondary, fontSize: 12, marginTop: 4 },
  saveButton: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  saveButtonText: { color: Colors.white, fontSize: 16, fontWeight: '800' },
});
