<div align="center">

<img src="./assets/symbol.svg" alt="BOKI" width="180" />

### 매매 원칙을 지켰는지, 스스로 복기하는 코인 트레이딩 저널

BOKI는 암호화폐 거래 내역을 자동으로 동기화하고, 스스로 세운 매매 원칙을 기준으로 거래를 복기하며,<br/>
AI 피드백을 통해 다음 매매를 더 나은 방향으로 이끄는 모바일 앱입니다.

[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Expo Router](https://img.shields.io/badge/Expo_Router-6-000020?logo=expo&logoColor=white)](https://docs.expo.dev/router/introduction/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand-5-443E38)](https://zustand-demo.pmnd.rs)
![Platform](https://img.shields.io/badge/platform-Android-lightgrey)

</div>

<br/>

## 목차

- [소개](#소개)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [폴더 구조](#폴더-구조)
- [API 연동](#api-연동)
- [Git 컨벤션](#git-컨벤션)
- [기여자](#기여자)

<br/>

## 소개

BOKI는 Expo Router 기반의 React Native 앱으로, 아래 사이클을 반복하며 매매 습관을 개선하는 것을 목표로 합니다.

> 거래소 연동 → 거래 동기화(또는 수동 입력) → 매매 원칙 기준 복기 → AI 리포트 확인 → 다음 매매에 반영

<br/>

## 주요 기능

| 카테고리    | 기능                                                           |
| ----------- | -------------------------------------------------------------- |
| 인증        | 소셜 로그인(Google, Kakao), 온보딩                             |
| 거래소 연동 | 업비트 API 키 등록 · 삭제 · 연결 상태 확인                     |
| 거래 관리   | 업비트 거래 내역 자동 동기화, 수동 거래 입력, 월별 거래 캘린더 |
| 복기(리뷰)  | 매매 원칙 세트 선택, 원칙별 점수 매기기, 메모·사진 첨부        |
| AI 리포트   | 원칙 준수율 기반 AI 피드백, 못 지킨 원칙 Top 3                 |
| 마이페이지  | 프로필 조회, 이용약관 · 개인정보 처리방침                      |

<br/>

## 기술 스택

**Core**
`React Native` `Expo` `Expo Router` `TypeScript`

**State & Data**
`Zustand` `TanStack Query` `Axios`

**UI**
`react-native-svg` `react-native-reanimated`

<br/>

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 채워주세요.

```bash
EXPO_PUBLIC_API_URL=https://api.boki.asia
```

### 3. 개발 서버 실행

```bash
npx expo start -c
```

### 4. 플랫폼 실행

```bash
npx expo run:android   # Android
```

<br/>

## 폴더 구조

```text
src
├── api        # 백엔드 API 요청
├── app        # Expo Router 화면
├── features   # 기능별 컴포넌트, 훅, 타입
├── shared     # 공통 컴포넌트, 색상, 타입
└── store      # 전역 상태
```

자주 보는 경로:

```text
src/api/client.ts          # Axios 기본 설정, 토큰 처리
src/api/exchange.ts        # 업비트 API 키, 거래 동기화
src/api/member.ts          # 내 프로필 조회
src/app/(tabs)             # 하단 탭 화면
src/features/trade         # 거래 관련 기능
src/features/review        # 복기, 리포트 관련 기능
```

<br/>

## API 연동

API 기본 주소는 `.env`의 `EXPO_PUBLIC_API_URL`을 사용합니다.

모든 요청은 `src/api/client.ts`의 `apiClient`를 통해 보냅니다. `apiClient`는 access token을 자동으로 요청 헤더에 붙이고, 401 응답이 오면 refresh token으로 토큰 재발급을 시도합니다.

Swagger 문서: [api.boki.asia/swagger-ui](https://api.boki.asia/swagger-ui/index.html)

<br/>

## Git 컨벤션

<details>
<summary>브랜치 전략</summary>

<br/>

항상 `develop`에서 새 브랜치를 만들어 작업합니다.

```bash
git switch develop
git pull origin develop
git switch -c feature/작업-이름
```

작업 후 필요한 파일만 add 합니다.

```bash
git status
git add src
git commit -m "feat: 작업 내용"
git push -u origin feature/작업-이름
```

PR은 아래 기준으로 만듭니다.

```text
base: develop
compare: feature/작업-이름
```

</details>

<details>
<summary>커밋 컨벤션</summary>

<br/>

```text
feat: 새로운 기능
fix: 버그 수정
style: UI 수정
refactor: 리팩토링
docs: 문서 수정
chore: 설정 및 기타 작업
```

예시:

```bash
git commit -m "feat: 프로필 API 연동"
git commit -m "fix: API 키 삭제 연동"
git commit -m "docs: README 정리"
```

</details>

<details>
<summary>주의사항</summary>

<br/>

- access token, refresh token, 실제 거래소 API 키는 커밋하지 않습니다.
- `.env`는 로컬에서만 관리합니다.
- 디자인 캡처나 임시 파일은 필요한 것만 선택해서 커밋합니다.
- `git add .`를 쓰기 전에는 반드시 `git status`를 확인합니다.
- 네이티브 모듈을 추가한 뒤에는 앱을 다시 빌드해야 합니다.

</details>

<br/>

## 기여자

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Batrnan">
        <img src="https://github.com/Batrnan.png" width="100" style="border-radius:50%" alt="Batrnan" /><br/>
        <b>Batrnan</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Kimoojin">
        <img src="https://github.com/Kimoojin.png" width="100" style="border-radius:50%" alt="Kimoojin" /><br/>
        <b>Kimoojin</b>
      </a>
    </td>
  </tr>
</table>
