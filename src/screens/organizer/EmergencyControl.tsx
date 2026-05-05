import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../components/Colors';

type TargetMode = 'zone' | 'all';
type MessageType = 'evacuate' | 'warning' | 'custom';

const ZONES = [
  { name: '백년관 버정길', status: 'danger' },
  { name: '자연과학대 앞', status: 'safe' },
  { name: '공대 흡연부스 옆', status: 'warning' },
  { name: '인경관 주차장 입구', status: 'safe' },
  { name: '공대-백년관 사이', status: 'warning' },
  { name: '백년관 잔디구장', status: 'safe' },
];

const MESSAGES = [
  {
    id: 'evacuate' as MessageType,
    title: '긴급 대피',
    desc: '즉시 해당 구역에서 대피해주세요',
    icon: 'warning-outline' as keyof typeof Ionicons.glyphMap,
    color: '#E93035',
    bg: '#FFF1F1',
    border: '#F6CACA',
  },
  {
    id: 'warning' as MessageType,
    title: '주의 경고',
    desc: '혼잡이 예상되니 주의해주세요',
    icon: 'notifications-outline' as keyof typeof Ionicons.glyphMap,
    color: '#F59E0B',
    bg: '#FFF8E8',
    border: '#F6E2A9',
  },
  {
    id: 'custom' as MessageType,
    title: '커스텀 메시지',
    desc: '직접 작성한 메시지 전송',
    icon: 'paper-plane-outline' as keyof typeof Ionicons.glyphMap,
    color: '#2F80ED',
    bg: '#EFF6FF',
    border: '#D9DEE8',
  },
];

function getZoneColor(status: string) {
  if (status === 'danger') return '#D0453B';
  if (status === 'warning') return '#F59E0B';
  return '#16A34A';
}

export default function EmergencyControl() {
  const [targetMode, setTargetMode] = useState<TargetMode>('zone');
  const [selectedMessage, setSelectedMessage] = useState<MessageType>('custom');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>긴급 통제 센터</Text>
          <Text style={styles.subtitle}>원클릭 긴급 알림 발송</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>대상 선택</Text>

          <View style={styles.segmentRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.segmentButton,
                targetMode === 'zone' && styles.segmentButtonActive,
              ]}
              onPress={() => setTargetMode('zone')}
            >
              <Ionicons
                name="warning-outline"
                size={18}
                color={targetMode === 'zone' ? Colors.white : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.segmentText,
                  targetMode === 'zone' && styles.segmentTextActive,
                ]}
              >
                특정 구역
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.segmentButton,
                targetMode === 'all' && styles.segmentButtonActive,
              ]}
              onPress={() => setTargetMode('all')}
            >
              <Ionicons
                name="people-outline"
                size={18}
                color={targetMode === 'all' ? Colors.white : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.segmentText,
                  targetMode === 'all' && styles.segmentTextActive,
                ]}
              >
                전체 참가자
              </Text>
            </TouchableOpacity>
          </View>

          {targetMode === 'zone' && (
            <View style={styles.zonePanel}>
              <Text style={styles.zonePanelTitle}>구역 선택 (복수 선택 가능)</Text>

              <View style={styles.zoneGrid}>
                {ZONES.map(zone => (
                  <TouchableOpacity key={zone.name} activeOpacity={0.85} style={styles.zoneChip}>
                    <View
                      style={[
                        styles.zoneDot,
                        { backgroundColor: getZoneColor(zone.status) },
                      ]}
                    />
                    <Text style={styles.zoneChipText}>{zone.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <Text style={[styles.sectionTitle, styles.messageTitle]}>메시지 유형</Text>

          <View style={styles.messageList}>
            {MESSAGES.map(message => {
              const selected = selectedMessage === message.id;

              return (
                <TouchableOpacity
                  key={message.id}
                  activeOpacity={0.86}
                  onPress={() => setSelectedMessage(message.id)}
                  style={[
                    styles.messageCard,
                    selected && {
                      borderColor: message.border,
                      backgroundColor: Colors.white,
                    },
                    !selected && styles.messageCardInactive,
                  ]}
                >
                  <View
                    style={[
                      styles.messageIconBox,
                      {
                        backgroundColor: selected ? message.bg : Colors.background,
                      },
                    ]}
                  >
                    <Ionicons
                      name={message.icon}
                      size={28}
                      color={selected ? message.color : Colors.textMuted}
                    />
                  </View>

                  <View style={styles.messageTextBlock}>
                    <Text
                      style={[
                        styles.messageCardTitle,
                        !selected && styles.inactiveText,
                      ]}
                    >
                      {message.title}
                    </Text>
                    <Text
                      style={[
                        styles.messageCardDesc,
                        !selected && styles.inactiveDesc,
                      ]}
                    >
                      {message.desc}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.sendCircle,
                      {
                        backgroundColor: selected ? message.color : '#E5E9EF',
                      },
                    ]}
                  >
                    <Ionicons
                      name="paper-plane-outline"
                      size={22}
                      color={selected ? Colors.white : Colors.textMuted}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const PRIMARY = '#2F80ED';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: 76,
    paddingBottom: 34,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 26,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 14,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  segmentButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  segmentButtonActive: {
    backgroundColor: PRIMARY,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.textSecondary,
  },
  segmentTextActive: {
    color: Colors.white,
  },
  zonePanel: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
  },
  zonePanelTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  zoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  zoneChip: {
    minWidth: '46%',
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoneDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  zoneChipText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.text,
  },
  messageTitle: {
    marginTop: 0,
  },
  messageList: {
    gap: 14,
  },
  messageCard: {
    minHeight: 96,
    borderRadius: 16,
    borderWidth: 1.3,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageCardInactive: {
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  messageIconBox: {
    width: 58,
    height: 58,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  messageTextBlock: {
    flex: 1,
  },
  messageCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 5,
  },
  messageCardDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  inactiveText: {
    color: Colors.textSecondary,
  },
  inactiveDesc: {
    color: Colors.textMuted,
  },
  sendCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});