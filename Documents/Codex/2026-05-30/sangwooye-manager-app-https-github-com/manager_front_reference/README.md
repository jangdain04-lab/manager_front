# 주최자용 앱 - React Native (Expo)

Figma Make에서 변환된 주최자용 군중 밀집도 모니터링 앱입니다.

## 📱 화면 구성

| 탭 | 화면 | 설명 |
|---|---|---|
| 대시보드 | OrganizerDashboard | 전체 구역 현황, 위험 예측, 빠른 실행 |
| 인력배치 | InteractiveMap | SVG 기반 구역 배치도, 스태프 위치 |
| 긴급통제 | EmergencyControl | 사이렌, 알림 대상 선택, 메시지 발송 |
| 사고기록 | IncidentLogs | 날짜별 사고 로그, 검색/필터 |
| 설정 | Settings | 알림, 계정, 앱 정보 |

### 서브 화면
- **SectorMonitoring**: 각 구역 밀집도 추이 차트, 인근 인원 배치 기능

## 🚀 실행 방법

### 사전 조건
- Node.js 18 이상
- Expo CLI 또는 npx

### 설치 및 실행

```bash
# 의존성 설치
npm install

# Expo 개발 서버 시작
npx expo start

# 또는 특정 플랫폼
npx expo start --ios      # iOS 시뮬레이터
npx expo start --android  # Android 에뮬레이터
```

### Expo Go 앱으로 실제 기기 테스트
1. iPhone/Android에 **Expo Go** 앱 설치
2. `npx expo start` 실행
3. QR코드 스캔

## 📦 주요 의존성

- `expo` ~52.0.0
- `@react-navigation/native` + `bottom-tabs` + `stack`
- `react-native-svg` — 구역 배치도 SVG 렌더링
- `@expo/vector-icons` — Ionicons 아이콘
- `react-native-safe-area-context` — 안전 영역 처리
- `react-native-reanimated` — 애니메이션 (선택적)

## 🗂 프로젝트 구조

```
rn_app/
├── App.tsx                    # 앱 진입점
├── app.json                   # Expo 설정
├── package.json
├── src/
│   ├── components/
│   │   └── Colors.ts          # 색상 상수 및 유틸
│   ├── data/
│   │   └── mockData.ts        # 목업 데이터 (실제 API로 교체 필요)
│   ├── navigation/
│   │   └── AppNavigator.tsx   # 네비게이션 구조
│   └── screens/
│       └── organizer/
│           ├── OrganizerDashboard.tsx
│           ├── InteractiveMap.tsx
│           ├── EmergencyControl.tsx
│           ├── IncidentLogs.tsx
│           ├── SectorMonitoring.tsx
│           └── Settings.tsx
```

## ⚠️ 실제 서비스 연결 시 교체 필요한 부분

1. **`src/data/mockData.ts`** → 실제 API 호출로 교체
2. **`InteractiveMap.tsx`** → 실제 지도 데이터 연동 (react-native-maps 추가 고려)
3. **`EmergencyControl.tsx`** → 실제 푸시 알림 API 연동 (Expo Notifications)
4. **로그인/인증** → 별도 Auth 화면 및 상태관리 추가 필요

## 🔧 추가 추천 패키지

```bash
# 실제 지도 사용 시
npx expo install react-native-maps

# 푸시 알림 연동 시
npx expo install expo-notifications

# 상태 관리
npm install zustand
# 또는
npm install @reduxjs/toolkit react-redux
```
