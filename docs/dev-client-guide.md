# Dev Client 빌드 & 설치 가이드

Expo Go는 카카오/구글 소셜 로그인의 딥링크 리다이렉트(`boki://auth/callback`)를 받을 수 없어서, 이 프로젝트는 **커스텀 dev client**로 테스트해야 합니다. 아래 과정은 한 번만 하면 되고, 이후에는 Expo Go 쓰듯이 `npx expo start`로 계속 개발하면 됩니다.

## 0. 사전 준비 (팀원 각자)

```bash
npm install -g eas-cli
eas login
```

- Expo 계정이 없다면 https://expo.dev 에서 가입 후 로그인
- 프로젝트 소유자가 EAS 프로젝트에 팀원을 초대해둬야 함 (expo.dev 대시보드 → 프로젝트 → Members)

## 1. 최초 1회: 프로젝트 EAS 연동 (프로젝트 소유자만)

```bash
eas init
```

- `app.json`에 `extra.eas.projectId`가 자동으로 추가됩니다. 이 변경은 커밋해서 팀원과 공유하세요.

## 2. Dev Client 빌드 (팀원 각자, 최초 1회 + 네이티브 모듈 추가될 때마다)

```bash
# Android
eas build --profile development --platform android

# iOS (Mac + Apple 개발자 계정 필요, 기기 UDID 등록 필요)
eas build --profile development --platform ios
```

- 빌드는 클라우드에서 진행되며 5~15분 정도 걸립니다.
- 빌드가 끝나면 터미널과 expo.dev 대시보드에 설치 링크(QR코드)가 뜹니다.
- **폰으로 그 QR코드/링크를 열어서 다운로드 및 설치** — 컴퓨터-폰 USB 연결 필요 없음.
- Android는 "출처를 알 수 없는 앱 설치" 권한만 허용하면 바로 설치됩니다.
- iOS는 최초 1회 기기를 EAS에 등록해야 해서(UDID), `eas device:create`로 기기를 먼저 등록한 뒤 빌드해야 합니다.

## 3. 일상 개발 (Expo Go와 동일한 흐름)

```bash
npx expo start
```

- 폰에서 Expo Go 앱이 아니라, **1~2단계에서 설치한 커스텀 "BOKI" 앱**을 엽니다.
- QR코드 스캔 또는 같은 화면에 뜨는 개발 서버에 연결하면 핫리로드로 코드가 반영됩니다.
- 카카오/구글 로그인도 이 앱 안에서는 `boki://auth/callback`이 정상적으로 앱으로 돌아오므로 정상 동작합니다.

## 4. 언제 다시 빌드해야 하나요?

JS/TS 코드만 바꾼 경우 → 재빌드 불필요, `npx expo start`만 다시 켜면 됨.

다시 빌드가 필요한 경우:
- `package.json`에 새로운 네이티브 모듈(예: `expo-camera`, 카카오/구글 네이티브 SDK 등) 추가/삭제
- `app.json`의 `plugins`, `scheme`, `permissions` 등 네이티브 설정 변경
- Expo SDK 버전 업그레이드

## 참고

- 리다이렉트 URI는 `src/features/auth/utils/socialLoginCallback.ts`에서 `Linking.createURL()`로 자동 생성됩니다. dev client/production 빌드에서는 `boki://auth/callback`, Expo Go에서는 `exp://...`가 생성되는데, 백엔드는 `boki://auth/callback`만 허용하므로 **소셜 로그인 테스트는 반드시 dev client에서 해야 합니다.**
