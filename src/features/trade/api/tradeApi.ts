import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type {
  Trade,
  TradeListParams,
  TradeCalendarParams,
  TradeCalendarSummary,
  CreateManualTradeInput,
} from '../types';

export const tradeApi = {
  list: (params?: TradeListParams) =>
    apiClient
      .get<ApiResponse<Trade[]>>('/api/trades', { params })
      .then((res) => res.data.result),

  calendar: (params: TradeCalendarParams) =>
    apiClient
      .get<ApiResponse<TradeCalendarSummary>>('/api/trades/calendar', { params })
      .then((res) => res.data.result),

  createManual: (data: CreateManualTradeInput) =>
    apiClient
      .post<ApiResponse<Trade>>('/api/trades/manual', data)
      .then((res) => res.data.result),
};
