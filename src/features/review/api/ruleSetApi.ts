import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type { RuleSet, RuleSetQueryType } from '../types';

export const ruleSetApi = {
  list: (type?: RuleSetQueryType) =>
    apiClient
      .get<ApiResponse<RuleSet[]>>('/api/rule-sets', {
        params: type ? { type } : undefined,
      })
      .then((res) => res.data.result),
};
