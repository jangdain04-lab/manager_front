export type DemoStatus = 'safe' | 'warning' | 'danger';

export type DemoZone = {
  id: string;
  camera: string;
  name: string;
  rawDensity: number;
  density: number;
  count: number;
  status: DemoStatus;
  staff: number;
};

export type DemoStaff = {
  id: string;
  name: string;
  role: string;
  sector: string;
  status: 'active' | 'standby';
};

export const DEMO_MAP_URL = 'https://generous-maternity-smugness.ngrok-free.dev/map';

export const DEMO_PLACES = [
  { id: 'cam1', camera: 'cam 1', name: '도서관 앞', staff: 1, peopleOffset: 18 },
  { id: 'cam2', camera: 'cam 2', name: '학생회관 앞', staff: 3, peopleOffset: 14 },
  { id: 'cam3', camera: 'cam 3', name: '후생관 앞', staff: 2, peopleOffset: 16 },
  { id: 'cam4', camera: 'cam 4', name: '공대 정류장', staff: 2, peopleOffset: 12 },
] as const;

export const DEMO_DENSITY_ROWS = [
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
] as const;

export const DEMO_STAFF: DemoStaff[] = [
  { id: 'staff1', name: '김민수', role: '안전관리', sector: '도서관 앞', status: 'active' },
  { id: 'staff2', name: '이지은', role: '안전관리', sector: '학생회관 앞', status: 'active' },
  { id: 'staff3', name: '박준호', role: '의료지원', sector: '학생회관 앞', status: 'active' },
  { id: 'staff4', name: '최수진', role: '안전관리', sector: '학생회관 앞', status: 'standby' },
  { id: 'staff5', name: '정다운', role: '안전관리', sector: '후생관 앞', status: 'active' },
  { id: 'staff6', name: '강태영', role: '의료지원', sector: '후생관 앞', status: 'active' },
  { id: 'staff7', name: '윤서연', role: '안전관리', sector: '공대 정류장', status: 'active' },
  { id: 'staff8', name: '한지훈', role: '안전관리', sector: '공대 정류장', status: 'standby' },
];

export function getDemoStatus(rawDensity: number): DemoStatus {
  if (rawDensity >= 12) return 'danger';
  if (rawDensity >= 7) return 'warning';
  return 'safe';
}

export function getDemoStatusLabel(status: DemoStatus) {
  if (status === 'danger') return '위험';
  if (status === 'warning') return '주의';
  return '여유';
}

export function getDemoStatusColor(status: DemoStatus) {
  if (status === 'danger') return '#EF4444';
  if (status === 'warning') return '#F59E0B';
  return '#16A34A';
}

export function getDemoStatusBg(status: DemoStatus) {
  if (status === 'danger') return '#FEE2E2';
  if (status === 'warning') return '#FEF3C7';
  return '#DCFCE7';
}

export function getDemoSecond() {
  return Math.floor(Date.now() / 1000) % DEMO_DENSITY_ROWS.length;
}

export function getDemoZones(second = getDemoSecond()): DemoZone[] {
  const row = DEMO_DENSITY_ROWS[second];
  const densities = row.slice(1);

  return DEMO_PLACES.map((place, index) => {
    const rawDensity = densities[index];
    const status = getDemoStatus(rawDensity);

    return {
      id: place.id,
      camera: place.camera,
      name: place.name,
      rawDensity,
      density: Math.min(100, Math.round((rawDensity / 18) * 100)),
      count: Math.max(0, rawDensity * 5 + place.peopleOffset),
      status,
      staff: place.staff,
    };
  });
}

export function getDemoStaffFor(placeName: string) {
  return DEMO_STAFF.filter((staff) => staff.sector === placeName);
}
