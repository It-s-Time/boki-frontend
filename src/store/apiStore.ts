import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiState {
  isApiConnected: boolean;
  setApiConnected: (connected: boolean) => void;
}

export const useApiStore = create<ApiState>()(
  persist(
    (set) => ({
      isApiConnected: false,
      setApiConnected: (connected) => set({ isApiConnected: connected }),
    }),
    {
      name: 'api-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
