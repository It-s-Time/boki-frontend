import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tradeApi } from '../api/tradeApi';
import { syncExchangeTrades } from '@/api/exchange';
import type { TradeListParams, UpdateManualTradeInput } from '../types';

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

export function useUpdateTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      tradeId,
      data,
    }: {
      tradeId: number;
      data: UpdateManualTradeInput;
    }) => tradeApi.update(tradeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tradeKeys.all });
    },
  });
}

export function useDeleteTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tradeId: number) => tradeApi.remove(tradeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tradeKeys.all });
    },
  });
}

// Shared by the FAB sync button and the post-API-key-registration auto-sync
// screen — both call this then need the same cache refresh on success.
export function useSyncTrades() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncExchangeTrades,
    onSuccess: (data) => {
      if (!data.isSuccess) return;
      const syncedTrades = data.result?.trades ?? [];
      queryClient.invalidateQueries({ queryKey: tradeKeys.all });
      if (syncedTrades.length > 0) {
        queryClient.setQueryData(tradeKeys.list(), syncedTrades);
      }
    },
  });
}
