# Crowd Safety App

Expo SDK 54 기반 React Native 관람객 안전 앱입니다.

## 실행

```bash
npm install
npx expo start --clear --host lan
```

## 이번 디자인 수정

- 하단 탭에서 경로 추천 탭을 제거했습니다.
- 홈, 안전 모니터링, 알림 3개 탭 구조로 재구성했습니다.
- 홈 화면을 SAFEPATH 로고, 주최자 공지, 위험 예측, 미아 찾기 카드 중심으로 Figma 캡처에 맞춰 재구현했습니다.
- 안전 모니터링 화면을 여유/주의/위험 3단계 히트맵과 구역별 밀집도 카드로 재구현했습니다.
- 알림 화면을 주최자 알림/위험 알림 섹션, 위험 배지, 진행 바, 고정/삭제 액션 구조로 재구현했습니다.
- `useWindowDimensions` 기반으로 여백, 글자 크기, 지도 높이, 카드 크기가 디바이스별로 조정되도록 반응형 처리했습니다.

## 검증

```bash
npx tsc --noEmit
npx expo install --check
npx expo export --platform ios
npx expo export --platform android
```
