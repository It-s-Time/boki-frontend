# BOKI Frontend

BOKI는 암호화폐 거래 내역을 기록하고, 매매 원칙을 기준으로 거래를 복기하는 모바일 앱입니다.

Expo Router 기반의 React Native 프로젝트이며 로그인, 거래 동기화, 매매 일지, AI 리포트, 마이페이지 기능을 제공합니다.

## 기술 스택

- React Native
- Expo
- Expo Router
- TypeScript
- Axios
- Zustand
- TanStack Query

## 실행 방법

의존성 설치:

```bash
npm install
```

환경변수 설정:

```bash
EXPO_PUBLIC_API_URL=https://api.boki.asia
```

개발 서버 실행:

```bash
npx expo start -c
```

Android 실행:

```bash
npx expo run:android
```

iOS 실행:

```bash
npx expo run:ios
```

## 주요 기능

- 소셜 로그인
- 업비트 API 키 등록, 삭제, 연결 상태 확인
- 업비트 거래 내역 동기화
- 수동 거래 입력
- 월별 거래 캘린더
- 거래 일지와 메모 확인
- 매매 원칙 점검
- AI 리포트 확인
- 마이페이지 프로필 조회
- 서비스 이용약관, 개인정보 처리방침 화면

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

## API 연동

API 기본 주소는 `.env`의 `EXPO_PUBLIC_API_URL`을 사용합니다.

```bash
EXPO_PUBLIC_API_URL=https://api.boki.asia
```

API 요청은 `src/api/client.ts`의 `apiClient`를 사용합니다.

`apiClient`는 access token을 자동으로 요청 헤더에 붙이고, 401 응답이 오면 refresh token으로 토큰 재발급을 시도합니다.

Swagger:

```text
https://api.boki.asia/swagger-ui/index.html
```

## Git 작업 흐름

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

PR은 GitHub에서 아래 기준으로 만듭니다.

```text
base: develop
compare: feature/작업-이름
```

## 커밋 컨벤션

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

## 주의사항

- access token, refresh token, 실제 거래소 API 키는 커밋하지 않습니다.
- `.env`는 로컬에서만 관리합니다.
- 디자인 캡처나 임시 파일은 필요한 것만 선택해서 커밋합니다.
- `git add .`를 쓰기 전에는 반드시 `git status`를 확인합니다.
- 네이티브 모듈을 추가한 뒤에는 앱을 다시 빌드해야 합니다.
