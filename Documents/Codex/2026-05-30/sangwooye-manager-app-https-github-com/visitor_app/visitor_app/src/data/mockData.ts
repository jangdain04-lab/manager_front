export type RiskLevel = 'relaxed' | 'warning' | 'danger';

export interface CrowdZone {
  id: string;
  name: string;
  density: number;
  riskLevel: RiskLevel;
  peopleCount: number;
  gridPos: { x: number; y: number };
}

export interface Alert {
  id: string;
  zoneId: string;
  zoneName: string;
  riskLevel: 'warning' | 'danger';
  timestamp: Date;
  message: string;
  read: boolean;
  pinned?: boolean;
  progress: number;
}

export interface MissingChild {
  id: string;
  name: string;
  age: number;
  imageUrl: string;
  description: string;
  lastSeenLocation: string;
  lastSeenTime: Date;
  contactNumber: string;
}

export interface OrganizerAnnouncement {
  id: string;
  title: string;
  summary: string;
  content: string;
  timestamp: Date;
  read: boolean;
  pinned?: boolean;
}

const DEMO_ZONES: CrowdZone[] = [
  { id: '1', name: '도서관 앞', density: 61, riskLevel: 'warning', peopleCount: 73, gridPos: { x: 29, y: 42 } },
  { id: '2', name: '학생회관 앞', density: 11, riskLevel: 'relaxed', peopleCount: 24, gridPos: { x: 74, y: 42 } },
  { id: '3', name: '후생관 앞', density: 39, riskLevel: 'warning', peopleCount: 51, gridPos: { x: 35, y: 72 } },
  { id: '4', name: '공대 정류장', density: 17, riskLevel: 'relaxed', peopleCount: 27, gridPos: { x: 78, y: 72 } },
];

export const mockZones: CrowdZone[] = DEMO_ZONES;

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    zoneId: '1',
    zoneName: '도서관 앞',
    riskLevel: 'warning',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    message: 'manager 앱에서 도서관 앞 주의 알림을 전송했습니다. 학생회관 앞 방향으로 우회해 주세요.',
    read: false,
    pinned: true,
    progress: 66,
  },
  {
    id: 'a2',
    zoneId: '4',
    zoneName: '공대 정류장',
    riskLevel: 'danger',
    timestamp: new Date(Date.now() - 13 * 60 * 1000),
    message: 'manager 앱에서 공대 정류장 위험 알림을 전송했습니다. 정류장 접근을 잠시 피해주세요.',
    read: false,
    progress: 88,
  },
];

export const mockMissingChildren: MissingChild[] = [
  {
    id: 'mc1',
    name: '김하준',
    age: 6,
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop',
    description: '노란색 후드, 청바지, 흰색 운동화 착용',
    lastSeenLocation: '학생회관 앞',
    lastSeenTime: new Date(Date.now() - 12 * 60000),
    contactNumber: '010-1234-5678',
  },
  {
    id: 'mc2',
    name: '이서윤',
    age: 7,
    imageUrl: 'https://images.unsplash.com/photo-1625363051343-f8d65b8803ce?w=400&h=400&fit=crop',
    description: '하늘색 원피스, 분홍색 가방 착용',
    lastSeenLocation: '후생관 앞',
    lastSeenTime: new Date(Date.now() - 24 * 60000),
    contactNumber: '010-8765-4321',
  },
];

export const mockAnnouncements: OrganizerAnnouncement[] = [
  {
    id: '1',
    title: 'manager 알림 · 도서관 앞 혼잡 안내',
    summary: 'manager 앱에서 도서관 앞 통행량 증가 알림을 전송했습니다.',
    content:
      '현재 도서관 앞 구역의 밀집도가 상승하고 있습니다.\n\n혼잡 구역 진입은 잠시 피하고, 학생회관 앞 또는 후생관 앞 방향으로 우회해 주세요. 안전요원의 안내가 있을 경우 현장 지시에 따라 이동해 주세요.',
    timestamp: new Date(Date.now() - 4 * 60000),
    read: false,
    pinned: true,
  },
  {
    id: '2',
    title: 'manager 알림 · 공대 정류장 승하차 위치 변경',
    summary: '공대 정류장 앞 대기 줄이 길어져 임시 승하차 위치를 운영합니다.',
    content:
      '공대 정류장 앞 대기 인원이 증가해 임시 승하차 위치를 운영합니다.\n\n버스 이용객은 안내 표지판을 따라 이동해 주시고, 차도 근처에서는 대기하지 말아 주세요.',
    timestamp: new Date(Date.now() - 18 * 60000),
    read: true,
  },
  {
    id: '3',
    title: 'manager 알림 · 후생관 앞 미아 보호소 운영',
    summary: '후생관 앞 안내 부스에서 미아 보호와 분실물 접수를 함께 진행합니다.',
    content:
      '후생관 앞 안내 부스에서 미아 보호소와 분실물 접수처를 운영합니다.\n\n보호자를 찾는 어린이를 발견했거나 분실물을 습득한 경우 가까운 운영요원에게 알려 주세요.',
    timestamp: new Date(Date.now() - 37 * 60000),
    read: true,
  },
];

export function getRiskColor(level: RiskLevel): string {
  return { relaxed: '#5DBB88', warning: '#ECA12D', danger: '#E24743' }[level];
}

export function getRiskBg(level: RiskLevel): string {
  return { relaxed: '#DDF4E9', warning: '#FFF3CE', danger: '#F8D6D9' }[level];
}

export function getRiskText(level: RiskLevel): string {
  return { relaxed: '여유', warning: '주의', danger: '위험' }[level];
}

export function getTimeAgo(ts: Date): string {
  const minutes = Math.floor((Date.now() - ts.getTime()) / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export function simulateDataUpdate(zones: CrowdZone[]): CrowdZone[] {
  return zones.map((zone) => {
    const change = Math.floor(Math.random() * 7) - 3;
    const density = Math.max(0, Math.min(100, zone.density + change));
    const riskLevel: RiskLevel = density >= 67 ? 'danger' : density >= 39 ? 'warning' : 'relaxed';
    return { ...zone, density, riskLevel };
  });
}
