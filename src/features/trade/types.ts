export type ApiTradeType = 'BUY' | 'SELL';
export type InputType = 'MANUAL';
export type ReviewStatus = 'COMPLETED' | 'NOT_COMPLETED';

export interface Trade {
  tradeId: number;
  memberId: number;
  coinType: string;
  tradeType: ApiTradeType;
  price: number;
  totalAmount: number;
  quantity: number;
  inputType: InputType;
  tradedAt: string;
  externalTradeId: string | null;
  createdAt: string;
  reviewStatus: ReviewStatus;
  reviewId: number | null;
}

export interface TradeListParams {
  date?: string;
  tradeType?: ApiTradeType;
  reviewStatus?: ReviewStatus;
}

export interface TradeCalendarParams {
  year: number;
  month: number;
}

export interface TradeCalendarDay {
  date: string;
  hasTrade: boolean;
  tradeCount: number;
  buyCount: number;
  sellCount: number;
}

export interface TradeCalendarSummary {
  year: number;
  month: number;
  days: TradeCalendarDay[];
}

export interface CreateManualTradeInput {
  coinType: string;
  tradeType: ApiTradeType;
  price: number;
  totalAmount: number;
  tradedAt: string;
}
