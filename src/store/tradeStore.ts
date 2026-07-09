import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trade, TradeType } from '@/features/home/types';

const SEED_TRADES: Trade[] = [
  {
    id: 1,
    date: '2026-05-29',
    coinName: '비트코인',
    amount: 1,
    symbol: 'BTC',
    type: 'buy',
    time: '14:32',
    price: 103403000,
    reviewed: false,
  },
  {
    id: 2,
    date: '2026-05-29',
    coinName: '리플',
    amount: 4,
    symbol: 'XRP',
    type: 'sell',
    time: '14:32',
    price: 103403000,
    reviewed: false,
  },
  {
    id: 3,
    date: '2026-05-24',
    coinName: '이더리움',
    amount: 1,
    symbol: 'ETH',
    type: 'buy',
    time: '09:12',
    price: 5200000,
    reviewed: false,
  },
];

interface TradeState {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, 'id' | 'reviewed'>) => number;
  setReviewed: (id: number, reviewed: boolean) => void;
}

export const useTradeStore = create<TradeState>()(
  persist(
    (set) => ({
      trades: SEED_TRADES,

      addTrade: (trade) => {
        const id = Date.now();
        set((state) => ({
          trades: [...state.trades, { ...trade, id, reviewed: false }],
        }));
        return id;
      },

      setReviewed: (id, reviewed) => {
        set((state) => ({
          trades: state.trades.map((t) =>
            t.id === id ? { ...t, reviewed } : t,
          ),
        }));
      },
    }),
    {
      name: 'trade-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function getTradeMarks(trades: Trade[]): Record<string, TradeType[]> {
  const marks: Record<string, TradeType[]> = {};
  for (const trade of trades) {
    const existing = marks[trade.date] ?? [];
    if (!existing.includes(trade.type)) {
      marks[trade.date] = [...existing, trade.type];
    }
  }
  return marks;
}
