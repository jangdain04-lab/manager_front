export type FrontendRiskLevel = 'safe' | 'warning' | 'danger';

export type ZoneLive = {
  zone_id: string;
  zone_name: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string | null;
  people_count?: number | null;
  count: number;
  density?: number | null;
  speed?: number | null;
  slope?: number | null;
  risk_level: FrontendRiskLevel;
  level: FrontendRiskLevel;
  status: FrontendRiskLevel;
  updated_at?: string | null;
};

export type SendAlertPayload = {
  target_mode: 'zone' | 'all';
  target_zones: string[];
  message_type: 'evacuate' | 'warning' | 'custom';
  message: string;
};

export type EmergencyAlertHistory = SendAlertPayload & {
  id: number;
  created_at: string;
};

export type EventSettings = {
  eventRange: string;
  searchPlace: string;
  placeDisplayName: string;
  cctvLocations: string[];
  placeNames: string[];
  roadAngles: string[];
  roadAreas: string[];
};

export type StaffMember = {
  id: number;
  name: string;
  role: string;
  phone?: string | null;
  email?: string | null;
  status: string;
  zone_id?: string | null;
  sector?: string | null;
};

export type StaffCreatePayload = {
  name: string;
  role: string;
  phone?: string;
  email?: string;
  zone_id?: string;
};

export type Notice = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export type RiskPrediction = {
  id: string;
  zone_id: string;
  sector: string;
  time: string;
  level: 'critical' | 'warning' | 'safe';
  progress: number;
  icon: string;
  values: number[];
};

export type IncidentLog = {
  id: string;
  time: string;
  date: string;
  sector: string;
  gate: string;
  level: 'critical';
  density: number;
  duration: string;
  description: string;
  image: string;
  stats: {
    time: string;
    density: number;
    speedChange: number;
  }[];
};

type NoticeResponse = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string | null;
};

const API_BASE_URL = 'http://192.168.0.49:8000';

function normalizeRiskLevel(level: string | null | undefined): FrontendRiskLevel {
  if (level === 'danger') return 'danger';
  if (level === 'warning' || level === 'caution') return 'warning';
  return 'safe';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${path}`);
  }

  return response.json();
}

export async function fetchZonesLive(): Promise<ZoneLive[]> {
  const zones = await request<ZoneLive[]>('/zones/live');

  return zones.map((zone) => {
    const level = normalizeRiskLevel(zone.risk_level ?? zone.status ?? zone.level);
    const count = zone.count ?? zone.people_count ?? 0;

    return {
      ...zone,
      name: zone.name ?? zone.zone_name,
      count,
      risk_level: level,
      level,
      status: level,
    };
  });
}

export async function sendEmergencyAlert(payload: SendAlertPayload) {
  return request<EmergencyAlertHistory>('/alerts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchEmergencyAlertHistory(): Promise<EmergencyAlertHistory[]> {
  return request<EmergencyAlertHistory[]>(`/alerts/history?t=${Date.now()}`);
}

export async function fetchEventSettings(): Promise<EventSettings> {
  return request<EventSettings>(`/events/current?t=${Date.now()}`);
}

export async function saveEventSettings(settings: EventSettings): Promise<EventSettings> {
  return request<EventSettings>('/events/current/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

export async function saveOnboardingSettings(settings: EventSettings): Promise<EventSettings> {
  return request<EventSettings>('/events/current/onboarding', {
    method: 'POST',
    body: JSON.stringify(settings),
  });
}

export async function fetchStaff(): Promise<StaffMember[]> {
  return request<StaffMember[]>('/staff');
}

export async function createStaff(payload: StaffCreatePayload): Promise<StaffMember> {
  return request<StaffMember>('/staff', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function assignStaffToZone(staffId: number, zoneId: string) {
  return request(`/sectors/${zoneId}/staff`, {
    method: 'POST',
    body: JSON.stringify({
      staff_id: staffId,
      zone_id: zoneId,
    }),
  });
}

function formatNoticeDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`;
}

function mapNotice(notice: NoticeResponse): Notice {
  return {
    id: notice.id,
    title: notice.title,
    content: notice.content,
    createdAt: formatNoticeDate(notice.created_at),
  };
}

export async function fetchNotices(): Promise<Notice[]> {
  const notices = await request<NoticeResponse[]>(`/notices?t=${Date.now()}`);

  return notices.map(mapNotice);
}

export async function createNotice(payload: {
  title: string;
  content: string;
}): Promise<Notice> {
  const notice = await request<NoticeResponse>('/notices', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return mapNotice(notice);
}

export async function updateNotice(
  noticeId: number,
  payload: {
    title: string;
    content: string;
  },
): Promise<Notice> {
  const notice = await request<NoticeResponse>(`/notices/${noticeId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return mapNotice(notice);
}

export async function deleteNotice(noticeId: number) {
  return request(`/notices/${noticeId}`, {
    method: 'DELETE',
  });
}

export async function fetchRiskPredictions(): Promise<RiskPrediction[]> {
  return request<RiskPrediction[]>(`/predictions?t=${Date.now()}`);
}

export async function fetchIncidents(params?: {
  date?: string;
  q?: string;
}): Promise<IncidentLog[]> {
  const query = new URLSearchParams();

  if (params?.date) {
    query.set('date', params.date);
  }

  if (params?.q) {
    query.set('q', params.q);
  }

  query.set('t', String(Date.now()));

  return request<IncidentLog[]>(`/incidents?${query.toString()}`);
}
