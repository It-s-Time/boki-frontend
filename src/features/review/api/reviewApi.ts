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

  data.images.forEach((asset, index) => {
    const filename =
      asset.fileName ?? asset.uri.split('/').pop() ?? `image_${index}.jpg`;
    // Content URIs (e.g. from Google Photos) often have no file extension,
    // so prefer the picker's own mimeType over guessing from the filename —
    // a wrong declared type here is what made the backend reject the upload.
    const ext = (/\.(\w+)$/.exec(filename)?.[1] ?? 'jpg').toLowerCase();
    const type = asset.mimeType ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    formData.append('images', {
      uri: asset.uri,
      name: filename,
      type,
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
        // Android RN's networking bridge only builds a multipart body when it
        // sees this header; without it FormData bodies fail to send at all
        // (ERR_NETWORK, no request even reaches the server).
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
