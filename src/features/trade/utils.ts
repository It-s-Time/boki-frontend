import { TradeCalendarDay } from './types';

export function toTradeMarks(
  days: TradeCalendarDay[],
): Record<string, { buyCount: number; sellCount: number }> {
  const marks: Record<string, { buyCount: number; sellCount: number }> = {};
  for (const day of days) {
    if (day.hasTrade) {
      marks[day.date] = { buyCount: day.buyCount, sellCount: day.sellCount };
    }
  }
  return marks;
}
