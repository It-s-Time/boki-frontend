import { apiClient } from './client';
import { type ApiResponse } from '@/shared/types/api';
import type { Trade } from '@/features/trade/types';

interface ApiKeySaveRequest {
  accessKey: string;
  secretKey: string;
}

interface ApiKeySaveResponse {
  memberId: number;
  connected: boolean;
}

interface ApiKeyStatusResponse {
  connected: boolean;
}

interface ExchangeTradeSyncResponse {
  syncedCount?: number;
  skippedCount?: number;
  trades?: Trade[];
}

export const saveExchangeApiKey = async (data: ApiKeySaveRequest) => {
  const response = await apiClient.post<ApiResponse<ApiKeySaveResponse>>(
    '/api/exchange/api-key',
    data,
  );

  return response.data;
};

export const getExchangeApiKeyStatus = async () => {
  const response =
    await apiClient.get<ApiResponse<ApiKeyStatusResponse>>(
      '/api/exchange/api-key',
    );

  return response.data;
};

export const deleteExchangeApiKey = async () => {
  const response = await apiClient.delete<ApiResponse<null>>(
    '/api/exchange/api-key',
  );

  return response.data;
};

export const syncExchangeTrades = async () => {
  const response = await apiClient.post<ApiResponse<ExchangeTradeSyncResponse>>(
    '/api/exchange/sync/trades',
    undefined,
    { timeout: 30000 },
  );

  return response.data;
};
