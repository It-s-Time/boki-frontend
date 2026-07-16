import { useQuery } from '@tanstack/react-query';
import { ruleSetApi } from '../api/ruleSetApi';
import { toPrincipleSet } from '../utils';
import type { RuleSetQueryType } from '../types';

export const ruleSetKeys = {
  list: (type?: RuleSetQueryType) => ['ruleSets', type ?? 'all'] as const,
};

export function useRuleSets(type?: RuleSetQueryType) {
  return useQuery({
    queryKey: ruleSetKeys.list(type),
    queryFn: () => ruleSetApi.list(type),
    select: (ruleSets) => ruleSets.map(toPrincipleSet),
  });
}
