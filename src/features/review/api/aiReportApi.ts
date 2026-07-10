import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type { AiReport } from '../types';

export const aiReportApi = {
  create: (tradeId: number) =>
    apiClient
      .post<ApiResponse<AiReport>>(`/api/ai-reports/${tradeId}`)
      .then((res) => res.data.result),

  get: (tradeId: number) =>
    apiClient
      .get<ApiResponse<AiReport>>(`/api/ai-reports/${tradeId}`)
      .then((res) => res.data.result),
};
