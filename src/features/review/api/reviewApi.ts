import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/shared/types/api';
import type { CreateReviewInput, Review, WorstRule } from '../types';

function buildReviewFormData(data: CreateReviewInput) {
  const formData = new FormData();
  formData.append(
    'request',
    JSON.stringify({
      ruleSetId: data.ruleSetId,
      scores: data.scores,
      content: data.content,
      replaceImages: data.replaceImages,
    }),
  );

  data.images.forEach((uri, index) => {
    const filename = uri.split('/').pop() ?? `image_${index}.jpg`;
    const ext = (/\.(\w+)$/.exec(filename)?.[1] ?? 'jpg').toLowerCase();
    formData.append('images', {
      uri,
      name: filename,
      type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    } as unknown as Blob);
  });

  return formData;
}

export const reviewApi = {
  create: (tradeId: number, data: CreateReviewInput) =>
    apiClient
      .post<ApiResponse<Review>>(
        `/api/trades/${tradeId}/reviews`,
        buildReviewFormData(data),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      .then((res) => res.data.result),

  get: (tradeId: number) =>
    apiClient
      .get<ApiResponse<Review>>(`/api/trades/${tradeId}/reviews`)
      .then((res) => res.data.result),

  remove: (tradeId: number) =>
    apiClient
      .delete<ApiResponse<string>>(`/api/trades/${tradeId}/reviews`)
      .then((res) => res.data.result),

  worstRules: () =>
    apiClient
      .get<ApiResponse<WorstRule[]>>('/api/reviews/worst-rules')
      .then((res) => res.data.result),
};
