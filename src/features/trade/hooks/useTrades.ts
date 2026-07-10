import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tradeApi } from '../api/tradeApi';
import type { TradeListParams } from '../types';

export const tradeKeys = {
  all: ['trades'] as const,
  list: (params?: TradeListParams) => ['trades', 'list', params ?? {}] as const,
  calendar: (year: number, month: number) => ['trades', 'calendar', year, month] as const,
};

export function useTradeList(params?: TradeListParams) {
  return useQuery({
    queryKey: tradeKeys.list(params),
    queryFn: () => tradeApi.list(params),
  });
}

export function useTradeCalendar(year: number, month: number) {
  return useQuery({
    queryKey: tradeKeys.calendar(year, month),
    queryFn: () => tradeApi.calendar({ year, month }),
    placeholderData: (prev) => prev,
  });
}

export function useCreateManualTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tradeApi.createManual,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tradeKeys.all });
    },
  });
}
