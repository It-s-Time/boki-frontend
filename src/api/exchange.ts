import { apiClient } from './client';
import { type ApiResponse } from '@/shared/types/api';

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
