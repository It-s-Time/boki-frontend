import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { exchangeLoginCode } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { hasSeenOnboarding } from '@/features/onboarding/utils/onboardingStorage';

const AUTH_CALLBACK_PATH = 'auth/callback';

export const AUTH_REDIRECT_URI = 'boki://auth/callback';

// singleTask launchMode(AndroidManifest)는 앱을 완전히 종료 후 재실행할 때
// 이전에 처리했던 딥링크 Intent를 다시 전달하는 경우가 있다. 그 안의 1회용
// loginCode로 재교환을 시도하면 서버가 401을 내려주므로, 마지막으로 성공한
// loginCode를 기억해두고 동일한 값이 재유입되면 조용히 무시한다.
const LAST_LOGIN_CODE_KEY = 'lastConsumedLoginCode';

const exchangeTasks = new Map<string, Promise<void>>();

const firstParam = (value: string | string[] | undefined): string | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

export const getLoginCodeFromCallbackUrl = (callbackUrl: string): string | null => {
  try {
    const parsed = Linking.parse(callbackUrl);
    const parsedLoginCode = firstParam(parsed.queryParams?.loginCode);
    if (parsedLoginCode) return parsedLoginCode;
  } catch {}

  try {
    const url = new URL(callbackUrl);
    const searchLoginCode = url.searchParams.get('loginCode');
    if (searchLoginCode) return searchLoginCode;

    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
    return hashParams.get('loginCode');
  } catch {
    return null;
  }
};

export const isAuthCallbackUrl = (callbackUrl: string): boolean => {
  try {
    const parsed = Linking.parse(callbackUrl);
    const path = parsed.path ?? '';
    const hostname = parsed.hostname ?? '';

    return path === AUTH_CALLBACK_PATH || `${hostname}/${path}` === AUTH_CALLBACK_PATH;
  } catch {
    return false;
  }
};

export const completeLoginWithCode = async (loginCode: string): Promise<void> => {
  const existingTask = exchangeTasks.get(loginCode);
  if (existingTask) {
    await existingTask;
    return;
  }

  const lastAttempted = await SecureStore.getItemAsync(LAST_LOGIN_CODE_KEY);
  if (lastAttempted === loginCode) {
    router.replace('/(auth)/signup');
    return;
  }

  // Record the attempt *before* the network call, not just on success.
  // singleTask can redeliver the same stale deep-link Intent on a JS-only
  // reload too (not just a cold start) — if we only remembered a code once
  // it succeeded, a code that fails (e.g. already expired) would retry on
  // every reload forever instead of just once.
  await SecureStore.setItemAsync(LAST_LOGIN_CODE_KEY, loginCode);

  const task = (async () => {
    const authData = await exchangeLoginCode(loginCode);
    await useAuthStore.getState().setAuth(authData);

    const seenOnboarding = await hasSeenOnboarding();
    router.replace(
      seenOnboarding ? '/(tabs)' : '/(onboarding)/setup-principles',
    );
  })();

  exchangeTasks.set(loginCode, task);

  try {
    await task;
  } finally {
    exchangeTasks.delete(loginCode);
  }
};

export const completeLoginWithCallbackUrl = async (
  callbackUrl: string,
): Promise<boolean> => {
  const loginCode = getLoginCodeFromCallbackUrl(callbackUrl);
  if (!loginCode) return false;

  await completeLoginWithCode(loginCode);
  return true;
};
