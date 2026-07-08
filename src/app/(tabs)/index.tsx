import { COLORS_NEW } from '@/shared/constants/colors';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TradeCalendar from '@/features/home/components/TradeCalendar';
import TradeCard from '@/features/home/components/TradeCard';
import { useTradeStore, getTradeMarks } from '@/store/tradeStore';

export default function HomeScreen() {
  const trades = useTradeStore((state) => state.trades);
  const tradeMarks = useMemo(() => getTradeMarks(trades), [trades]);

  const [currentDate, setCurrentDate] = useState('2026-05-01');
  const [selectedDate, setSelectedDate] = useState('2026-05-29');

  const selectedTrades = trades.filter((trade) => trade.date === selectedDate);

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

          {selectedTrades.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>거래 내역이 없어요</Text>
            </View>
          ) : (
            selectedTrades.map((trade) => (
              <TradeCard key={trade.id} trade={trade} />
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
