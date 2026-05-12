import { Platform } from 'react-native';

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

const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://127.0.0.1:8000';

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
  return request('/alerts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
