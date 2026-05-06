import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../components/Colors';

const THEME = {
  primary: '#55CCC4',
  primaryLight: '#E9FFFD',
  dark: '#111827',
};

export default function Settings() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const sections = [
    {
      title: '알림 설정',
      items: [
        { icon: 'notifications', label: '푸시 알림', type: 'toggle', value: notificationsEnabled, onChange: setNotificationsEnabled },
        { icon: 'volume-high', label: '알림음', type: 'toggle', value: soundEnabled, onChange: setSoundEnabled },
      ],
    },
    {
      title: '표시 설정',
      items: [
        { icon: 'moon', label: '다크 모드', type: 'toggle', value: darkMode, onChange: setDarkMode },
      ],
    },
    {
      title: '계정',
      items: [
        { icon: 'person', label: '프로필 설정', type: 'link', onPress: () => Alert.alert('준비 중') },
        { icon: 'shield-checkmark', label: '보안 설정', type: 'link', onPress: () => Alert.alert('준비 중') },
      ],
    },
    {
      title: '앱 정보',
      items: [
        { icon: 'information-circle', label: '버전 정보', type: 'info', value: '1.0.0' },
        { icon: 'document-text', label: '개인정보처리방침', type: 'link', onPress: () => Alert.alert('준비 중') },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.dark} />
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>설정</Text>
          <Text style={styles.subtitle}>앱 환경 설정</Text>
        </View>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color={THEME.primary} />
        </View>

        <View>
          <Text style={styles.profileName}>주최자</Text>
          <Text style={styles.profileEmail}>organizer@event.com</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
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
                        size={18}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.dark,
  },

  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    margin: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.dark,
  },

  profileEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  section: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    paddingLeft: 4,
  },

  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingLabel: {
    fontSize: 15,
    color: THEME.dark,
    fontWeight: '500',
  },

  settingValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  logoutSection: {
    paddingHorizontal: 24,
    marginTop: 8,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dangerLight,
    borderRadius: 16,
    padding: 16,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.danger,
  },
});