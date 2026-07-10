import { useQuery } from '@tanstack/react-query';
import { ruleSetApi } from '../api/ruleSetApi';
import { toPrincipleSet } from '../utils';
import type { RuleSetQueryType } from '../types';

export function useRuleSets(type?: RuleSetQueryType) {
  return useQuery({
    queryKey: ['ruleSets', type ?? 'all'],
    queryFn: () => ruleSetApi.list(type),
    select: (ruleSets) => ruleSets.map(toPrincipleSet),
  });
}
