import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { exchangeLoginCode } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

const AUTH_CALLBACK_PATH = 'auth/callback';

export const AUTH_REDIRECT_URI = 'boki://auth/callback';

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

  const task = (async () => {
    const authData = await exchangeLoginCode(loginCode);
    await useAuthStore.getState().setAuth(authData);
    router.replace('/(tabs)');
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
