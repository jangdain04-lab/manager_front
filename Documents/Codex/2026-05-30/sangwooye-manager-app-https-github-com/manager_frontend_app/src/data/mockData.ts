import { DEMO_PLACES, DEMO_STAFF, getDemoZones } from './demoData';

export interface CrowdZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  density: number;
  riskLevel: 'safe' | 'moderate' | 'warning' | 'danger';
  peopleCount: number;
}

export interface Alert {
  id: string;
  zoneId: string;
  zoneName: string;
  riskLevel: 'warning' | 'danger';
  timestamp: Date;
  message: string;
  read: boolean;
}

export interface Route {
  id: string;
  name: string;
  distance: number;
  estimatedTime: number;
  crowdLevel: 'low' | 'medium' | 'high';
  waypoints: { lat: number; lng: number }[];
}

export interface Sector {
  id: string;
  name: string;
  density: number;
  status: 'safe' | 'warning' | 'critical';
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  sector: string;
  status: 'active' | 'break' | 'offline';
  phone: string;
}

export interface IncidentLog {
  id: string;
  timestamp: Date;
  sector: string;
  type: 'injury' | 'congestion' | 'evacuation' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
  resolved: boolean;
}

const zones = getDemoZones(1);

export const mockZones: CrowdZone[] = zones.map((zone, index) => ({
  id: zone.id,
  name: zone.name,
  lat: 37.449 + index * 0.001,
  lng: 126.654 + index * 0.001,
  density: zone.density,
  riskLevel: zone.status === 'safe' ? 'safe' : zone.status,
  peopleCount: zone.count,
}));

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    zoneId: DEMO_PLACES[1].id,
    zoneName: DEMO_PLACES[1].name,
    riskLevel: 'warning',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    message: '학생회관 앞 혼잡도가 상승 중입니다. 인력 재배치를 준비하세요.',
    read: false,
  },
  {
    id: 'a2',
    zoneId: DEMO_PLACES[3].id,
    zoneName: DEMO_PLACES[3].name,
    riskLevel: 'danger',
    timestamp: new Date(Date.now() - 13 * 60 * 1000),
    message: '공대 정류장 대기열이 길어져 통행 분리가 필요합니다.',
    read: false,
  },
];

export const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: '도서관 앞 우회 동선',
    distance: 420,
    estimatedTime: 6,
    crowdLevel: 'low',
    waypoints: [{ lat: 37.449, lng: 126.654 }, { lat: 37.45, lng: 126.655 }],
  },
  {
    id: 'r2',
    name: '공대 정류장 분산 동선',
    distance: 610,
    estimatedTime: 8,
    crowdLevel: 'medium',
    waypoints: [{ lat: 37.452, lng: 126.657 }, { lat: 37.451, lng: 126.656 }],
  },
];

export const mockSectors: Sector[] = zones.map((zone) => ({
  id: zone.camera,
  name: zone.name,
  density: zone.density,
  status: zone.status === 'danger' ? 'critical' : zone.status,
}));

export const mockStaff: Staff[] = DEMO_STAFF.map((person) => ({
  id: person.id,
  name: person.name,
  role: person.role,
  sector: person.sector,
  status: person.status === 'standby' ? 'break' : 'active',
  phone: '010-0000-0000',
}));

export const mockIncidentLogs: IncidentLog[] = [
  {
    id: 'l1',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    sector: '도서관 앞',
    type: 'congestion',
    severity: 'medium',
    description: '도서관 앞 이동 속도 저하, 안전요원 배치 완료',
    resolved: true,
  },
  {
    id: 'l2',
    timestamp: new Date(Date.now() - 31 * 60 * 1000),
    sector: '공대 정류장',
    type: 'congestion',
    severity: 'high',
    description: '정류장 탑승 대기열 증가, 통행로 분리 안내 중',
    resolved: false,
  },
];
