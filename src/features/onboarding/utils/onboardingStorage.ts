import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_SEEN_ONBOARDING_KEY = 'hasSeenOnboarding';

export const hasSeenOnboarding = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(HAS_SEEN_ONBOARDING_KEY);
  return value === 'true';
};

export const markOnboardingSeen = async (): Promise<void> => {
  await AsyncStorage.setItem(HAS_SEEN_ONBOARDING_KEY, 'true');
};
