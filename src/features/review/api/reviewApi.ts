import { apiClient } from '../../../api/client';
import type { CreateReviewInput, Review } from '../types';

export const reviewApi = {
  create: (data: CreateReviewInput) =>
    apiClient.post<Review>('/reviews', data).then((res) => res.data),

  getById: (id: string) =>
    apiClient.get<Review>(`/reviews/${id}`).then((res) => res.data),
};
