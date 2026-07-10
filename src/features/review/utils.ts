import { Principle, PrincipleSet, Rule, RuleSet } from './types';

function toPrinciples(rules: Rule[], type: 'buy' | 'sell'): Principle[] {
  return rules.map((rule) => ({
    id: String(rule.ruleId),
    type,
    order: rule.orderIndex + 1,
    content: rule.content,
  }));
}

export function toPrincipleSet(ruleSet: RuleSet): PrincipleSet {
  const buyPrinciples = toPrinciples(ruleSet.buyRules, 'buy');
  const sellPrinciples = toPrinciples(ruleSet.sellRules, 'sell');

  return {
    id: String(ruleSet.ruleSetId),
    name: ruleSet.name,
    description: ruleSet.description,
    buyCount: buyPrinciples.length,
    sellCount: sellPrinciples.length,
    principles: [...buyPrinciples, ...sellPrinciples],
  };
}
