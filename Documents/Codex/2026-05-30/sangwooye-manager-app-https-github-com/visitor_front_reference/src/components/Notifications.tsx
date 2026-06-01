import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getTimeAgo, mockAlerts, mockAnnouncements, type Alert } from '../data/mockData';

const COLORS = {
  text: '#111827',
  muted: '#8B95A1',
  mint: '#7BCBC6',
  danger: '#DF7473',
  warning: '#E99A3D',
  dangerStrong: '#E24743',
  line: '#EEF1F4',
};

type NotifyLevel = 'warning' | 'danger';

function useResponsive() {
  const { width, height } = useWindowDimensions();
  const base = Math.min(width, height);
  const scale = Math.min(Math.max(base / 390, 0.86), 1.16);
  const horizontal = Math.max(22, Math.min(34, width * 0.085));

  return { scale, horizontal };
}

export function Notifications() {
  const { scale, horizontal } = useResponsive();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifyLevel, setNotifyLevel] = useState<NotifyLevel>('warning');
  const announcement = mockAnnouncements[0];

  const unreadCount = alerts.filter((alert) => !alert.read).length;

  const sortedAlerts = useMemo(() => {
    return [...alerts].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }, [alerts]);

  const togglePin = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, pinned: !alert.pinned } : alert,
      ),
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingHorizontal: horizontal,
            paddingBottom: 28,
          },
        ]}
      >
        <View
          style={[
            styles.header,
            {
              marginTop: 36 * scale,
              marginBottom: 18 * scale,
            },
          ]}
        >
          <View style={styles.titleRow}>
            <Text style={[styles.title, { fontSize: 36 * scale }]}>
              알림
            </Text>

            {unreadCount > 0 && (
              <View
                style={[
                  styles.badge,
                  {
                    width: 35 * scale,
                    height: 35 * scale,
                    borderRadius: 17.5 * scale,
                  },
                ]}
              >
                <Text style={[styles.badgeText, { fontSize: 15 * scale }]}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setSettingsOpen(true)}
          >
            <Ionicons
              name="settings-outline"
              size={31 * scale}
              color={COLORS.text}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.subtitle,
            {
              fontSize: 15 * scale,
              marginBottom: 34 * scale,
            },
          ]}
        >
          위험한 상황이 발생하면 알려드려요
        </Text>

        <SectionHeader title="주최자 알림" scale={scale} />

        <View
          style={[
            styles.announcementCard,
            {
              marginBottom: 34 * scale,
            },
          ]}
        >
          <View style={styles.announcementStripe} />

          <View style={styles.announcementIcon}>
            <Ionicons
              name="megaphone-outline"
              size={20 * scale}
              color={COLORS.mint}
            />
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.announcementTitleRow}>
              <Text style={[styles.cardTitle, { fontSize: 15 * scale }]}>
                {announcement.title}
              </Text>
              <View style={styles.unreadDot} />
            </View>

            <Text style={[styles.announcementText, { fontSize: 14 * scale }]}>
              {announcement.summary}
            </Text>

            <View style={styles.announcementFooter}>
              <View style={styles.timeRow}>
                <Ionicons
                  name="time-outline"
                  size={16 * scale}
                  color="#ADB5BD"
                />
                <Text style={[styles.timeText, { fontSize: 12 * scale }]}>
                  {getTimeAgo(new Date(Date.now() - 6 * 60 * 1000))}
                </Text>
              </View>

              <Ionicons
                name="trash-outline"
                size={18 * scale}
                color="#ADB5BD"
              />
            </View>
          </View>
        </View>

        <SectionHeader title="위험 알림" scale={scale} />

        {sortedAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            scale={scale}
            onTogglePin={() => togglePin(alert.id)}
            onDelete={() => deleteAlert(alert.id)}
          />
        ))}
      </ScrollView>

      <SettingsModal
        visible={settingsOpen}
        selectedLevel={notifyLevel}
        onSelect={setNotifyLevel}
        onClose={() => setSettingsOpen(false)}
      />
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  scale,
}: {
  title: string;
  scale: number;
}) {
  return (
    <View
      style={[
        styles.sectionHeader,
        {
          marginBottom: 12 * scale,
        },
      ]}
    >
      <Ionicons
        name="megaphone-outline"
        size={20 * scale}
        color={COLORS.mint}
      />

      <Text style={[styles.sectionTitle, { fontSize: 19 * scale }]}>
        {title}
      </Text>
    </View>
  );
}

function PushPinIcon({
  color,
  active,
  size = 16,
}: {
  color: string;
  active?: boolean;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: size * 0.21,
          backgroundColor: active ? color : 'transparent',
          borderWidth: active ? 0 : 1.7,
          borderColor: color,
        }}
      />

      <View
        style={{
          width: 1.7,
          height: size * 0.58,
          backgroundColor: color,
          marginTop: -1,
        }}
      />
    </View>
  );
}

function AlertCard({
  alert,
  scale,
  onTogglePin,
  onDelete,
}: {
  alert: Alert;
  scale: number;
  onTogglePin: () => void;
  onDelete: () => void;
}) {
  const isDanger = alert.riskLevel === 'danger';
  const color = isDanger ? COLORS.danger : COLORS.warning;

  return (
    <View
      style={[
        styles.alertCard,
        {
          marginBottom: 12 * scale,
        },
      ]}
    >
      <View style={styles.alertTop}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.alertTitle, { fontSize: 14 * scale }]}>
            {alert.zoneName}
          </Text>

          <Text style={[styles.alertMessage, { fontSize: 13 * scale }]}>
            {alert.message}
          </Text>
        </View>

        <View style={[styles.riskChip, { backgroundColor: color }]}>
          <Text style={[styles.riskChipText, { fontSize: 12 * scale }]}>
            {isDanger ? '위험' : '주의'}
          </Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${alert.progress}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      <View style={styles.alertFooter}>
        <View style={styles.footerLeft}>
          <Text style={[styles.timeText, { fontSize: 12 * scale }]}>
            {getTimeAgo(alert.timestamp)}
          </Text>

          {alert.pinned && (
            <>
              <PushPinIcon color="#C74B69" active size={14 * scale} />
              <Text style={[styles.pinnedText, { fontSize: 12 * scale }]}>
                고정됨
              </Text>
            </>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onTogglePin}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <PushPinIcon
              color={alert.pinned ? COLORS.mint : '#ADB5BD'}
              active={alert.pinned}
              size={17 * scale}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="trash-outline"
              size={18 * scale}
              color="#ADB5BD"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function SettingsModal({
  visible,
  selectedLevel,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selectedLevel: NotifyLevel;
  onSelect: (level: NotifyLevel) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.settingsBackdrop}>
        <View style={styles.settingsSheet}>
          <View style={styles.sheetHandle} />

          <Text style={styles.settingsTitle}>
            어느 단계부터 알림을 받을까요?
          </Text>

          <Text style={styles.settingsSubtitle}>
            원하는 단계를 선택하세요
          </Text>

          <NotifyOption
            level="warning"
            selected={selectedLevel === 'warning'}
            title="주의"
            subtitle="주의 단계 이상 알림"
            onPress={() => onSelect('warning')}
          />

          <NotifyOption
            level="danger"
            selected={selectedLevel === 'danger'}
            title="위험"
            subtitle="위험 단계만 알림"
            onPress={() => onSelect('danger')}
          />

          <View style={styles.settingsDivider} />

          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.86}
            onPress={onClose}
          >
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function NotifyOption({
  level,
  selected,
  title,
  subtitle,
  onPress,
}: {
  level: NotifyLevel;
  selected: boolean;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const color = level === 'warning' ? COLORS.warning : COLORS.danger;

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[
        styles.notifyOption,
        selected && {
          borderColor: color,
          backgroundColor:
            level === 'warning' ? '#FFF9EF' : '#FFF5F5',
        },
      ]}
    >
      <View
        style={[
          styles.notifyIcon,
          selected && {
            backgroundColor: color,
          },
        ]}
      >
        <Ionicons
          name="warning-outline"
          size={23}
          color={selected ? '#fff' : '#ADB5BD'}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.notifyTitle}>{title}</Text>
        <Text style={styles.notifySubtitle}>{subtitle}</Text>
      </View>

      {selected && (
        <Ionicons
          name="checkmark-circle-outline"
          size={27}
          color={color}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },

  scroll: {
    flexGrow: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  title: {
    color: COLORS.text,
    fontWeight: '900',
    letterSpacing: 0,
  },

  badge: {
    backgroundColor: COLORS.dangerStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    color: '#fff',
    fontWeight: '900',
  },

  settingsButton: {
    padding: 5,
  },

  subtitle: {
    color: COLORS.muted,
    fontWeight: '500',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  sectionTitle: {
    color: COLORS.mint,
    fontWeight: '900',
  },

  announcementCard: {
    backgroundColor: '#fff',
    minHeight: 132,
    borderRadius: 15,
    padding: 18,
    paddingLeft: 25,
    flexDirection: 'row',
    gap: 13,
    shadowColor: '#111827',
    shadowOpacity: 0.055,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 2,
    overflow: 'hidden',
  },

  announcementStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.mint,
  },

  announcementIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#F2FAF9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  announcementTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  cardTitle: {
    color: COLORS.text,
    fontWeight: '900',
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.mint,
  },

  announcementText: {
    color: '#566173',
    lineHeight: 23,
    marginTop: 16,
    marginBottom: 15,
    fontWeight: '500',
  },

  announcementFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  timeText: {
    color: '#ADB5BD',
    fontWeight: '500',
  },

  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 17,
    shadowColor: '#111827',
    shadowOpacity: 0.05,
    shadowRadius: 11,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 2,
  },

  alertTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  alertTitle: {
    color: COLORS.text,
    fontWeight: '900',
    marginBottom: 8,
  },

  alertMessage: {
    color: COLORS.muted,
    lineHeight: 22,
    fontWeight: '500',
  },

  riskChip: {
    minWidth: 64,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  riskChipText: {
    color: '#fff',
    fontWeight: '900',
  },

  progressTrack: {
    height: 4,
    backgroundColor: '#F1F3F5',
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
  },

  alertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  pinnedText: {
    color: COLORS.mint,
    fontWeight: '800',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  settingsBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.62)',
    justifyContent: 'flex-end',
  },

  settingsSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 38,
  },

  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DFE3E8',
    marginBottom: 38,
  },

  settingsTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },

  settingsSubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 28,
  },

  notifyOption: {
    minHeight: 102,
    borderRadius: 16,
    backgroundColor: '#F7F8FA',
    borderWidth: 1.5,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  notifyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9EDF2',
  },

  notifyTitle: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '900',
    marginBottom: 6,
  },

  notifySubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: '600',
  },

  settingsDivider: {
    height: 1,
    backgroundColor: COLORS.line,
    marginTop: 14,
    marginBottom: 28,
  },

  confirmButton: {
    height: 66,
    borderRadius: 13,
    backgroundColor: COLORS.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
});
