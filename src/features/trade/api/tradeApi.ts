import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type {
  Trade,
  TradeListParams,
  TradeCalendarParams,
  TradeCalendarSummary,
  CreateManualTradeInput,
  UpdateManualTradeInput,
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

  update: (tradeId: number, data: UpdateManualTradeInput) =>
    apiClient
      .patch<ApiResponse<Trade>>(`/api/trades/${tradeId}`, data)
      .then((res) => res.data.result),

  remove: (tradeId: number) =>
    apiClient
      .delete<ApiResponse<string>>(`/api/trades/${tradeId}`)
      .then((res) => res.data.result),
};
