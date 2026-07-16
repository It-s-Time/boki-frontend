import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type { AiReport } from '../types';

// AI 리포트 생성은 LLM 호출을 동반해 apiClient의 기본 10초 타임아웃을 넘기기 쉬우므로
// 이 요청만 별도로 넉넉한 타임아웃을 준다.
const AI_REPORT_CREATE_TIMEOUT_MS = 60000;

export const aiReportApi = {
  create: (tradeId: number) =>
    apiClient
      .post<ApiResponse<AiReport>>(`/api/ai-reports/${tradeId}`, undefined, {
        timeout: AI_REPORT_CREATE_TIMEOUT_MS,
      })
      .then((res) => res.data.result),

  get: (tradeId: number) =>
    apiClient
      .get<ApiResponse<AiReport>>(`/api/ai-reports/${tradeId}`)
      .then((res) => res.data.result),
};
