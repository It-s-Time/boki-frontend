import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '../api/reviewApi';
import type { CreateReviewInput } from '../types';

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
      queryClient.invalidateQueries({ queryKey: ['review', tradeId] });
    },
  });
}

export function useReview(tradeId: number | undefined) {
  return useQuery({
    queryKey: ['review', tradeId],
    queryFn: () => reviewApi.get(tradeId as number),
    enabled: tradeId !== undefined,
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tradeId: number) => reviewApi.remove(tradeId),
    onSuccess: (_result, tradeId) => {
      queryClient.invalidateQueries({ queryKey: ['review', tradeId] });
    },
  });
}

export function useWorstRules() {
  return useQuery({
    queryKey: ['worstRules'],
    queryFn: reviewApi.worstRules,
  });
}
