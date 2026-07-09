import { COLORS_NEW } from '@/shared/constants/colors';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TradeCalendar from '@/features/home/components/TradeCalendar';
import TradeCard from '@/features/home/components/TradeCard';
import { useTradeCalendar, useTradeList } from '@/features/trade/hooks/useTrades';
import { toTradeMarks } from '@/features/trade/utils';

const toDateString = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState(() => toDateString(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => toDateString(new Date()));

  const currentYear = parseInt(currentDate.slice(0, 4));
  const currentMonth = parseInt(currentDate.slice(5, 7));

  const { data: calendarSummary } = useTradeCalendar(currentYear, currentMonth);
  const tradeMarks = useMemo(
    () => toTradeMarks(calendarSummary?.days ?? []),
    [calendarSummary],
  );

  const {
    data: selectedTrades,
    isLoading: isListLoading,
    isError: isListError,
    refetch: refetchList,
  } = useTradeList({ date: selectedDate });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        <TradeCalendar
          currentDate={currentDate}
          selectedDate={selectedDate}
          tradeMarks={tradeMarks}
          onMonthChange={setCurrentDate}
          onDateSelect={setSelectedDate}
        />

        <View style={styles.tradeSection}>
          <Text style={styles.tradeTitle}>
            {`${parseInt(selectedDate.slice(5, 7))}월 ${parseInt(selectedDate.slice(8, 10))}일 거래 내역`}
          </Text>

          {isListLoading ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>불러오는 중이에요</Text>
            </View>
          ) : isListError ? (
            <Pressable style={styles.emptyCard} onPress={() => refetchList()}>
              <Text style={styles.emptyText}>불러오지 못했어요, 다시 시도해주세요</Text>
            </Pressable>
          ) : !selectedTrades || selectedTrades.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>거래 내역이 없어요</Text>
            </View>
          ) : (
            selectedTrades.map((trade) => (
              <TradeCard key={trade.tradeId} trade={trade} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
    paddingHorizontal: 24,
    paddingTop: 44,
  },

  tradeSection: {
    marginTop: 20,
  },

  tradeTitle: {
    fontSize: 22,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 16,
  },

  emptyCard: {
    backgroundColor: COLORS_NEW.background,
    borderRadius: 8,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },
});
