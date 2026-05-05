export type TradeType = 'buy' | 'sell';

export type Trade = {
  id: number;
  date: string;
  coinName: string;
  amount: number;
  symbol: string;
  type: TradeType;
  time: string;
  price: number;
  reviewed: boolean;
};
