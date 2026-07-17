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

export function shiftYearMonth(year: number, month: number, delta: number) {
  const date = new Date(year, month - 1 + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}
