import type { Alert, CrowdZone, MissingChild, OrganizerAnnouncement } from '../data/mockData';

const MAP_URL = 'https://generous-maternity-smugness.ngrok-free.dev/map';
const VISITOR_DEVICE_ID = 'visitor-demo-app';

export type NotificationRiskLevel = 'warning' | 'danger';

export function resolveBackendUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return MAP_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return MAP_URL;
}

export interface FestivalContact {
  label: string;
  phone: string;
}

export interface FestivalInfo {
  id: number;
  title: string;
  date: string;
  time: string;
  place: string;
  description: string[];
  contacts: FestivalContact[];
  cautions: string[];
}

export interface PublicDeviceSettings {
  deviceId: string;
  pushToken?: string | null;
  platform?: string | null;
  minRiskLevel: NotificationRiskLevel;
}

export interface InviteVerifyResponse {
  valid: boolean;
  role?: string | null;
  message: string;
}

type DemoDensityRow = [number, number, number, number, number];

const CAMERAS = [
  { id: '1', camera: 'cam 1', name: '도서관 앞', gridPos: { x: 29, y: 42 } },
  { id: '2', camera: 'cam 2', name: '학생회관 앞', gridPos: { x: 74, y: 42 } },
  { id: '3', camera: 'cam 3', name: '후생관 앞', gridPos: { x: 35, y: 72 } },
  { id: '4', camera: 'cam 4', name: '공대 정류장', gridPos: { x: 78, y: 72 } },
] as const;

const DEMO_DENSITY_ROWS: DemoDensityRow[] = [
  [1, 11, 2, 7, 3],
  [2, 6, 3, 7, 5],
  [3, 6, 3, 8, 4],
  [4, 5, 4, 8, 3],
  [5, 5, 3, 5, 1],
  [6, 9, 4, 5, 2],
  [7, 5, 4, 4, 1],
  [8, 6, 8, 9, 2],
  [9, 4, 12, 11, 4],
  [10, 6, 15, 12, 5],
  [11, 5, 9, 8, 6],
  [12, 8, 5, 8, 11],
  [13, 3, 9, 5, 6],
  [14, 1, 5, 4, 6],
  [15, 5, 6, 3, 5],
  [16, 9, 4, 1, 5],
  [17, 6, 6, 2, 9],
  [18, 7, 5, 1, 5],
  [19, 10, 8, 2, 6],
  [20, 12, 3, 7, 4],
  [21, 15, 1, 7, 6],
  [22, 13, 5, 5, 5],
  [23, 9, 9, 2, 8],
  [24, 7, 5, 3, 3],
  [25, 9, 5, 8, 1],
  [26, 9, 4, 6, 5],
  [27, 10, 9, 7, 7],
  [28, 14, 11, 8, 8],
  [29, 8, 12, 9, 8],
  [30, 9, 8, 6, 5],
  [31, 7, 3, 7, 5],
  [32, 7, 1, 11, 4],
  [33, 5, 5, 6, 9],
  [34, 2, 9, 6, 11],
  [35, 3, 6, 5, 12],
  [36, 8, 7, 5, 8],
  [37, 6, 10, 9, 8],
  [38, 7, 12, 5, 5],
  [39, 8, 15, 6, 4],
  [40, 15, 13, 4, 3],
  [41, 18, 8, 6, 1],
  [42, 12, 5, 5, 2],
  [43, 12, 4, 10, 1],
  [44, 13, 3, 14, 2],
  [45, 8, 1, 8, 7],
  [46, 5, 2, 9, 6],
  [47, 1, 1, 7, 4],
  [48, 0, 2, 7, 6],
  [49, 0, 7, 5, 5],
  [50, 5, 7, 2, 8],
  [51, 6, 5, 3, 3],
  [52, 4, 2, 8, 1],
  [53, 5, 3, 3, 5],
  [54, 8, 8, 5, 9],
  [55, 9, 6, 4, 6],
  [56, 4, 7, 3, 7],
  [57, 3, 8, 1, 10],
  [58, 3, 9, 2, 12],
  [59, 5, 6, 1, 15],
  [60, 6, 7, 2, 12],
];

const DEMO_ANNOUNCEMENTS: OrganizerAnnouncement[] = [
  {
    id: 'notice-1',
    title: '운영본부 · 도서관 앞 혼잡 안내',
    summary: '도서관 앞 통행량이 증가하고 있습니다. 학생회관 앞 방향으로 우회해 주세요.',
    content:
      '현재 도서관 앞 구역의 밀집도가 상승하고 있습니다.\n\n혼잡 구역 진입은 잠시 피하고, 학생회관 앞 또는 후생관 앞 방향으로 우회해 주세요. 안전요원의 안내가 있을 경우 현장 지시에 따라 이동해 주세요.',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    read: false,
    pinned: true,
  },
  {
    id: 'notice-2',
    title: '운영본부 · 공대 정류장 승하차 위치 변경',
    summary: '공대 정류장 앞 대기 줄이 길어져 임시 승하차 위치를 운영합니다.',
    content:
      '공대 정류장 앞 대기 인원이 증가해 임시 승하차 위치를 운영합니다.\n\n버스 이용객은 안내 표지판을 따라 이동해 주시고, 차도 근처에서는 대기하지 말아 주세요.',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    read: true,
  },
  {
    id: 'notice-3',
    title: '운영본부 · 후생관 앞 미아 보호소 운영',
    summary: '후생관 앞 안내 부스에서 미아 보호와 분실물 접수를 함께 진행합니다.',
    content:
      '후생관 앞 안내 부스에서 미아 보호소와 분실물 접수처를 운영합니다.\n\n보호자를 찾는 어린이를 발견했거나 분실물을 습득한 경우 가까운 운영요원에게 알려 주세요.',
    timestamp: new Date(Date.now() - 37 * 60 * 1000),
    read: true,
  },
];

const DEMO_MISSING_CHILDREN: MissingChild[] = [
  {
    id: 'child-1',
    name: '김하준',
    age: 6,
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop',
    description: '노란색 후드, 청바지, 흰색 운동화 착용',
    lastSeenLocation: '학생회관 앞',
    lastSeenTime: new Date(Date.now() - 12 * 60 * 1000),
    contactNumber: '010-1234-5678',
  },
  {
    id: 'child-2',
    name: '이서윤',
    age: 7,
    imageUrl: 'https://images.unsplash.com/photo-1625363051343-f8d65b8803ce?w=400&h=400&fit=crop',
    description: '하늘색 원피스, 분홍색 가방 착용',
    lastSeenLocation: '후생관 앞',
    lastSeenTime: new Date(Date.now() - 24 * 60 * 1000),
    contactNumber: '010-8765-4321',
  },
];

const DEMO_FESTIVAL_INFO: FestivalInfo = {
  id: 1,
  title: '캠퍼스 축제 안전 안내',
  date: '2026년 5월 30일',
  time: '오후 2시 - 오후 10시',
  place: '도서관 앞, 학생회관 앞, 후생관 앞, 공대 정류장',
  description: [
    'CCTV 기반 밀집도 변화와 현장 안전 알림을 실시간으로 확인할 수 있습니다.',
    '혼잡도가 높은 구역은 색상과 알림으로 표시되며, 지도와 구역 카드에서 현재 상태를 확인할 수 있습니다.',
    '위험 상황을 발견하면 빠른 신고 기능을 눌러 운영요원에게 상황을 전달할 수 있습니다.',
  ],
  contacts: [
    { label: '행사 본부', phone: '02-1234-5678' },
    { label: '안전 관리팀', phone: '02-8765-4321' },
  ],
  cautions: [
    '혼잡 구역에서는 멈춰 서지 말고 천천히 이동해 주세요.',
    '위험 알림이 표시되면 안내된 우회 동선을 이용해 주세요.',
    '미아 또는 응급 상황 발견 시 가까운 운영요원에게 알려 주세요.',
  ],
};

export const DEMO_REFRESH_INTERVAL_MS = 5000;

function getDemoRow(): DemoDensityRow {
  const index = Math.floor(Date.now() / DEMO_REFRESH_INTERVAL_MS) % DEMO_DENSITY_ROWS.length;
  return DEMO_DENSITY_ROWS[index];
}

function getDemoSecond() {
  return getDemoRow()[0];
}

function getRiskLevel(rawDensity: number): CrowdZone['riskLevel'] {
  if (rawDensity >= 12) return 'danger';
  if (rawDensity >= 7) return 'warning';
  return 'relaxed';
}

function toCrowdZone(cameraIndex: number, rawDensity: number): CrowdZone {
  const camera = CAMERAS[cameraIndex];
  const densityPercent = Math.min(100, Math.round((rawDensity / 18) * 100));

  return {
    id: camera.id,
    camera: camera.camera,
    name: camera.name,
    density: densityPercent,
    riskLevel: getRiskLevel(rawDensity),
    peopleCount: rawDensity,
    gridPos: camera.gridPos,
  };
}

function buildDemoZones(): CrowdZone[] {
  const [, cam1, cam2, cam3, cam4] = getDemoRow();
  return [cam1, cam2, cam3, cam4].map((density, index) => toCrowdZone(index, density));
}

function buildZoneAlert(zone: CrowdZone): Alert | null {
  if (zone.riskLevel === 'relaxed') return null;

  const isDanger = zone.riskLevel === 'danger';

  return {
    id: `demo-alert-${zone.id}-${zone.riskLevel}`,
    zoneId: zone.id,
    zoneName: zone.name,
    riskLevel: isDanger ? 'danger' : 'warning',
    timestamp: new Date(Date.now() - Number(zone.id) * 60 * 1000),
    message: `${zone.name}(${zone.camera}) 구역이 ${isDanger ? '위험' : '주의'} 단계입니다. 안내된 우회 동선을 이용해 주세요.`,
    read: false,
    pinned: isDanger,
    progress: isDanger ? 88 : 66,
  };
}

export async function verifyInviteCode(_code: string): Promise<InviteVerifyResponse> {
  return {
    valid: true,
    role: 'visitor',
    message: '방문객 모드로 입장합니다.',
  };
}

export async function fetchPublicLiveZones(): Promise<CrowdZone[]> {
  return buildDemoZones();
}

export async function fetchPublicAnnouncements(): Promise<OrganizerAnnouncement[]> {
  return DEMO_ANNOUNCEMENTS.map((item) => ({ ...item }));
}

export async function fetchPublicAlerts(): Promise<Alert[]> {
  return buildDemoZones()
    .map(buildZoneAlert)
    .filter((alert): alert is Alert => alert !== null)
    .sort((a, b) => {
      if (a.riskLevel !== b.riskLevel) return a.riskLevel === 'danger' ? -1 : 1;
      return b.progress - a.progress;
    });
}

async function updatePublicAlertState(
  _alertId: string,
  _updates: { read?: boolean; pinned?: boolean; deleted?: boolean },
) {
  return Promise.resolve();
}

export function markPublicAlertRead(alertId: string) {
  return updatePublicAlertState(alertId, { read: true });
}

export function setPublicAlertPinned(alertId: string, pinned: boolean) {
  return updatePublicAlertState(alertId, { pinned });
}

export function deletePublicAlert(alertId: string) {
  return updatePublicAlertState(alertId, { deleted: true });
}

export interface VisitorReportPayload {
  type: 'current' | 'place' | 'organizer';
  zoneId?: string;
  zoneName?: string;
  memo?: string;
}

export async function createVisitorReport(payload: VisitorReportPayload) {
  return {
    id: `report-${Date.now()}`,
    deviceId: VISITOR_DEVICE_ID,
    status: 'received',
    ...payload,
  };
}

export async function fetchPublicMissingChildren(): Promise<MissingChild[]> {
  return DEMO_MISSING_CHILDREN.map((child) => ({ ...child }));
}

export async function fetchPublicMissingChild(id: string): Promise<MissingChild> {
  const child = DEMO_MISSING_CHILDREN.find((item) => item.id === id);
  if (!child) throw new Error('미아 정보를 찾을 수 없습니다.');
  return { ...child };
}

export async function fetchPublicFestivalInfo(): Promise<FestivalInfo> {
  return { ...DEMO_FESTIVAL_INFO };
}

export async function fetchPublicMapUrl(): Promise<string> {
  return MAP_URL;
}

export async function registerPublicDevicePushToken(
  minRiskLevel: NotificationRiskLevel = 'warning',
  pushToken?: string,
): Promise<PublicDeviceSettings> {
  return {
    deviceId: VISITOR_DEVICE_ID,
    pushToken,
    platform: 'expo',
    minRiskLevel,
  };
}

export async function fetchPublicNotificationSettings(): Promise<PublicDeviceSettings | null> {
  return {
    deviceId: VISITOR_DEVICE_ID,
    platform: 'expo',
    minRiskLevel: 'warning',
  };
}

export async function updatePublicNotificationSettings(
  minRiskLevel: NotificationRiskLevel,
  pushToken?: string,
): Promise<PublicDeviceSettings> {
  return {
    deviceId: VISITOR_DEVICE_ID,
    pushToken,
    platform: 'expo',
    minRiskLevel,
  };
}
