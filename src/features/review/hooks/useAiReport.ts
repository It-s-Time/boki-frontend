import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiReportApi } from '../api/aiReportApi';
import { tradeKeys } from '@/features/trade/hooks/useTrades';

export function useCreateAiReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tradeId: number) => aiReportApi.create(tradeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tradeKeys.all });
    },
  });
}

export function useAiReport(tradeId: number | undefined) {
  return useQuery({
    queryKey: ['aiReport', tradeId],
    queryFn: () => aiReportApi.get(tradeId as number),
    enabled: tradeId !== undefined,
    refetchInterval: (query) =>
      query.state.data?.status === 'PENDING' ? 2000 : false,
  });
}
