import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Colors } from '../../components/Colors';
import { fetchEventSettings, saveEventSettings } from '../../services/api';

const THEME = {
  primary: '#55CCC4',
  primaryLight: '#E9FFFD',
  dark: '#111827',
};

const MAP_URL = 'https://generous-maternity-smugness.ngrok-free.dev/map.html';

type PlaceInfo = {
  eventRange: string;
  searchPlace: string;
  placeDisplayName: string;
  cctvLocations: string[];
  placeNames: string[];
  roadAngles: string[];
  roadAreas: string[];
};

const initialPlaceInfo: PlaceInfo = {
  eventRange: '인하대학교 축제 구역',
  searchPlace: '인하대학교',
  placeDisplayName: '인하대학교 축제',
  cctvLocations: [
    '백년관 버정길 CCTV',
    '자연과학대 앞 CCTV',
    '공대 흡연부스 옆 CCTV',
    '인경관 주차장 입구 CCTV',
    '공대-백년관 사이 CCTV',
    '백년관 잔디구장 CCTV',
  ],
  placeNames: [
    '백년관 버정길',
    '자연과학대 앞',
    '공대 흡연부스 옆',
    '인경관 주차장 입구',
    '공대-백년관 사이',
    '백년관 잔디구장',
  ],
  roadAngles: ['90', '75', '60', '80', '70', '85'],
  roadAreas: ['120', '180', '145', '160', '135', '200'],
};

export default function Settings() {
  const navigation = useNavigation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [placeSettingVisible, setPlaceSettingVisible] = useState(false);
  const [selectedStep, setSelectedStep] = useState(1);
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo>(initialPlaceInfo);
  const [placeInfoLoadError, setPlaceInfoLoadError] = useState('');

  const updateArrayValue = (
    key: 'cctvLocations' | 'placeNames' | 'roadAngles' | 'roadAreas',
    index: number,
    value: string,
  ) => {
    setPlaceInfo((prev) => {
      const updated = [...prev[key]];
      updated[index] = value;

      return {
        ...prev,
        [key]: updated,
      };
    });
  };

  const loadPlaceInfo = async () => {
    try {
      const settings = await fetchEventSettings();
      setPlaceInfoLoadError('');
      setPlaceInfo(settings);
    } catch (error) {
      console.warn('Failed to load event settings', error);
      setPlaceInfoLoadError('백엔드 장소 정보를 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    loadPlaceInfo();
  }, []);

  useEffect(() => {
    if (placeSettingVisible) {
      loadPlaceInfo();
    }
  }, [placeSettingVisible]);

  const savePlaceInfo = async () => {
    try {
      const saved = await saveEventSettings(placeInfo);
      setPlaceInfo(saved);
      Alert.alert('저장 완료', '장소 정보 설정이 수정되었습니다.');
      setPlaceSettingVisible(false);
    } catch (error) {
      Alert.alert('저장 실패', '백엔드 서버 연결을 확인해주세요.');
    }
  };

  const sections = [
    {
      title: '알림 설정',
      items: [
        {
          icon: 'notifications',
          label: '푸시 알림',
          type: 'toggle',
          value: notificationsEnabled,
          onChange: setNotificationsEnabled,
        },
        {
          icon: 'volume-high',
          label: '알림음',
          type: 'toggle',
          value: soundEnabled,
          onChange: setSoundEnabled,
        },
      ],
    },
    {
      title: '표시 설정',
      items: [
        {
          icon: 'moon',
          label: '다크 모드',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode,
        },
      ],
    },
    {
      title: '계정',
      items: [
        {
          icon: 'person',
          label: '프로필 설정',
          type: 'link',
          onPress: () => Alert.alert('준비 중'),
        },
        {
          icon: 'shield-checkmark',
          label: '보안 설정',
          type: 'link',
          onPress: () => Alert.alert('준비 중'),
        },
      ],
    },
    {
      title: '앱 정보',
      items: [
        {
          icon: 'information-circle',
          label: '버전 정보',
          type: 'info',
          value: '1.0.0',
        },
        {
          icon: 'document-text',
          label: '개인정보처리방침',
          type: 'link',
          onPress: () => Alert.alert('준비 중'),
        },
      ],
    },
  ];

  if (placeSettingVisible) {
    return (
      <View style={styles.placeScreen}>
        <View style={styles.placeHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setPlaceSettingVisible(false)}
          >
            <Ionicons name="arrow-back" size={26} color={THEME.dark} />
          </TouchableOpacity>

          <View>
            <Text style={styles.placeHeaderTitle}>장소 정보 설정</Text>
            <Text style={styles.placeHeaderSub}>Step 1~5 데이터를 수정합니다</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.placeScrollContent}
        >
          {placeInfoLoadError.length > 0 && (
            <View style={styles.errorBox}>
              <Ionicons name="warning-outline" size={20} color="#D0453B" />
              <Text style={styles.errorText}>{placeInfoLoadError}</Text>
            </View>
          )}

          <View style={styles.stepTabs}>
            {[1, 2, 3, 4, 5].map((step) => (
              <TouchableOpacity
                key={step}
                style={[
                  styles.stepTab,
                  selectedStep === step && styles.stepTabActive,
                ]}
                onPress={() => setSelectedStep(step)}
              >
                <Text
                  style={[
                    styles.stepTabText,
                    selectedStep === step && styles.stepTabTextActive,
                  ]}
                >
                  {step}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.editCard}>
            {selectedStep === 1 && (
              <>
                <Text style={styles.editTitle}>STEP 1. 행사 장소 범위</Text>
                <Text style={styles.editDesc}>
                  지도에서 행사 장소를 확인하고 장소 이름과 범위를 수정합니다.
                </Text>

                <Text style={styles.inputLabel}>장소 검색</Text>
                <View style={styles.searchInputBox}>
                  <TextInput
                    style={styles.searchTextInput}
                    value={placeInfo.searchPlace}
                    onChangeText={(text) =>
                      setPlaceInfo((prev) => ({
                        ...prev,
                        searchPlace: text,
                      }))
                    }
                    placeholder="장소를 검색하세요"
                    placeholderTextColor="#AEB6C2"
                  />
                  <Ionicons name="search-outline" size={22} color="#9CA3AF" />
                </View>

                <View style={styles.mapContainer}>
                  <WebView
                    source={{ uri: MAP_URL }}
                    style={styles.webview}
                    javaScriptEnabled
                    domStorageEnabled
                    geolocationEnabled
                    originWhitelist={['*']}
                    mixedContentMode="always"
                  />
                </View>

                <Text style={styles.inputLabel}>장소 이름</Text>
                <TextInput
                  style={styles.input}
                  value={placeInfo.placeDisplayName}
                  onChangeText={(text) =>
                    setPlaceInfo((prev) => ({
                      ...prev,
                      placeDisplayName: text,
                    }))
                  }
                  placeholder="장소 이름을 입력하세요"
                  placeholderTextColor="#AEB6C2"
                />

                <Text style={styles.inputLabel}>행사 범위</Text>
                <TextInput
                  style={styles.input}
                  value={placeInfo.eventRange}
                  onChangeText={(text) =>
                    setPlaceInfo((prev) => ({
                      ...prev,
                      eventRange: text,
                    }))
                  }
                  placeholder="행사 장소 범위를 입력하세요"
                  placeholderTextColor="#AEB6C2"
                />
              </>
            )}

            {selectedStep === 2 && (
              <>
                <Text style={styles.editTitle}>STEP 2. CCTV 위치</Text>
                <Text style={styles.editDesc}>
                  지도에서 CCTV 위치를 확인하고 각 CCTV 이름을 수정합니다.
                </Text>

                <View style={styles.mapContainer}>
                  <WebView
                    source={{ uri: MAP_URL }}
                    style={styles.webview}
                    javaScriptEnabled
                    domStorageEnabled
                    geolocationEnabled
                    originWhitelist={['*']}
                    mixedContentMode="always"
                  />
                </View>

                {placeInfo.cctvLocations.map((item, index) => (
                  <View key={index}>
                    <Text style={styles.inputLabel}>{index + 1}번 CCTV 이름</Text>
                    <TextInput
                      style={styles.input}
                      value={item}
                      onChangeText={(text) =>
                        updateArrayValue('cctvLocations', index, text)
                      }
                      placeholder="CCTV 이름 또는 위치를 입력하세요"
                      placeholderTextColor="#AEB6C2"
                    />
                  </View>
                ))}
              </>
            )}

            {selectedStep === 3 && (
              <>
                <Text style={styles.editTitle}>STEP 3. 장소 이름</Text>
                <Text style={styles.editDesc}>
                  각 CCTV 또는 구역에 연결된 장소명을 수정합니다.
                </Text>

                {placeInfo.placeNames.map((item, index) => (
                  <View key={index}>
                    <Text style={styles.inputLabel}>{index + 1}번 장소</Text>
                    <TextInput
                      style={styles.input}
                      value={item}
                      onChangeText={(text) =>
                        updateArrayValue('placeNames', index, text)
                      }
                      placeholder="장소 이름을 입력하세요"
                      placeholderTextColor="#AEB6C2"
                    />
                  </View>
                ))}
              </>
            )}

            {selectedStep === 4 && (
              <>
                <Text style={styles.editTitle}>STEP 4. 각 길의 각도</Text>
                <Text style={styles.editDesc}>
                  각 장소별 길의 각도 정보를 수정합니다.
                </Text>

                {placeInfo.roadAngles.map((item, index) => (
                  <View key={index}>
                    <Text style={styles.inputLabel}>
                      {placeInfo.placeNames[index]} 각도
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={item}
                      onChangeText={(text) =>
                        updateArrayValue('roadAngles', index, text)
                      }
                      placeholder="예: 90"
                      placeholderTextColor="#AEB6C2"
                      keyboardType="numeric"
                    />
                  </View>
                ))}
              </>
            )}

            {selectedStep === 5 && (
              <>
                <Text style={styles.editTitle}>STEP 5. 각 길의 면적</Text>
                <Text style={styles.editDesc}>
                  각 장소별 길의 면적 정보를 수정합니다.
                </Text>

                {placeInfo.roadAreas.map((item, index) => (
                  <View key={index}>
                    <Text style={styles.inputLabel}>
                      {placeInfo.placeNames[index]} 면적
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={item}
                      onChangeText={(text) =>
                        updateArrayValue('roadAreas', index, text)
                      }
                      placeholder="예: 120"
                      placeholderTextColor="#AEB6C2"
                      keyboardType="numeric"
                    />
                  </View>
                ))}
              </>
            )}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={savePlaceInfo}>
            <Text style={styles.saveButtonText}>저장하기</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={THEME.dark} />
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>설정</Text>
          <Text style={styles.subtitle}>앱 환경 설정</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={34} color={THEME.primary} />
          </View>

          <View>
            <Text style={styles.profileName}>주최자</Text>
            <Text style={styles.profileEmail}>organizer@event.com</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>행사 설정</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.placeSettingCard}
            onPress={() => setPlaceSettingVisible(true)}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconBox}>
                <Ionicons name="map" size={22} color={THEME.primary} />
              </View>

              <View>
                <Text style={styles.settingLabel}>장소 정보 설정</Text>
                <Text style={styles.settingSub}>
                  Step 1~5 입력 정보를 수정합니다
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {sections.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <View style={styles.sectionCard}>
              {section.items.map((item: any, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.settingItem,
                    i < section.items.length - 1 && styles.settingItemBorder,
                  ]}
                  onPress={item.type === 'link' ? item.onPress : undefined}
                  activeOpacity={item.type === 'link' ? 0.7 : 1}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.iconBox}>
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={THEME.primary}
                      />
                    </View>

                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>

                  {item.type === 'toggle' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onChange}
                      trackColor={{
                        false: Colors.border,
                        true: THEME.primary,
                      }}
                      thumbColor={Colors.white}
                    />
                  )}

                  {item.type === 'link' && (
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={Colors.textMuted}
                    />
                  )}

                  {item.type === 'info' && (
                    <Text style={styles.settingValue}>{item.value}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() =>
              Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
                { text: '취소', style: 'cancel' },
                { text: '로그아웃', style: 'destructive' },
              ])
            }
          >
            <Ionicons name="log-out" size={18} color={Colors.danger} />
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: Colors.white,
  },

  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: THEME.dark,
  },

  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    margin: 24,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 28,
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: THEME.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileName: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.dark,
  },

  profileEmail: {
    fontSize: 17,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },

  section: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginBottom: 12,
    paddingLeft: 4,
  },

  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },

  placeSettingCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    minHeight: 78,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  settingItem: {
    minHeight: 78,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: THEME.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  settingLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.dark,
  },

  settingSub: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },

  settingValue: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  logoutSection: {
    paddingHorizontal: 24,
    marginTop: 4,
  },

  logoutBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF1F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  logoutText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: '800',
  },

  placeScreen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: Colors.white,
  },

  placeHeaderTitle: {
    fontSize: 27,
    fontWeight: '900',
    color: THEME.dark,
  },

  placeHeaderSub: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },

  placeScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },

  errorBox: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#FFF1F1',
    borderWidth: 1,
    borderColor: '#F3CFCF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#D0453B',
  },

  stepTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    padding: 5,
    marginBottom: 22,
  },

  stepTab: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepTabActive: {
    backgroundColor: THEME.primary,
  },

  stepTabText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.textSecondary,
  },

  stepTabTextActive: {
    color: Colors.white,
  },

  editCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },

  editTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: THEME.dark,
    marginBottom: 8,
  },

  editDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginBottom: 8,
  },

  input: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '700',
    color: THEME.dark,
    marginBottom: 14,
  },

  searchInputBox: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchTextInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: THEME.dark,
  },

  mapContainer: {
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  webview: {
    flex: 1,
  },

  saveButton: {
    height: 60,
    borderRadius: 18,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.white,
  },
});
