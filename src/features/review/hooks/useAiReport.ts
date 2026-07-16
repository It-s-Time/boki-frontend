import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiReportApi } from '../api/aiReportApi';
import { tradeKeys } from '@/features/trade/hooks/useTrades';

export const aiReportKeys = {
  detail: (tradeId: number | undefined) => ['aiReport', tradeId] as const,
};

export function useCreateAiReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tradeId: number) => aiReportApi.create(tradeId),
    onSuccess: (_result, tradeId) => {
      queryClient.invalidateQueries({ queryKey: tradeKeys.all });
      queryClient.invalidateQueries({ queryKey: aiReportKeys.detail(tradeId) });
    },
  });
}

export function useAiReport(tradeId: number | undefined) {
  return useQuery({
    queryKey: aiReportKeys.detail(tradeId),
    queryFn: () => aiReportApi.get(tradeId as number),
    enabled: tradeId !== undefined,
    refetchInterval: (query) =>
      query.state.data?.status === 'PENDING' ? 2000 : false,
  });
}
