import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '../api/reviewApi';
import type { CreateReviewInput } from '../types';

export const reviewKeys = {
  detail: (tradeId: number | undefined) => ['review', tradeId] as const,
  worstRules: ['worstRules'] as const,
};

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tradeId,
      data,
    }: {
      tradeId: number;
      data: CreateReviewInput;
    }) => reviewApi.create(tradeId, data),
    onSuccess: (_result, { tradeId }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(tradeId) });
    },
  });
}

export function useReview(tradeId: number | undefined) {
  return useQuery({
    queryKey: reviewKeys.detail(tradeId),
    queryFn: () => reviewApi.get(tradeId as number),
    enabled: tradeId !== undefined,
  });
}

export function useWorstRules() {
  return useQuery({
    queryKey: reviewKeys.worstRules,
    queryFn: reviewApi.worstRules,
  });
}
