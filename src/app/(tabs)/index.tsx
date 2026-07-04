import { COLORS } from '@/shared/constants/colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from 'assets/icons/logo.svg';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import TradeCalendar from '@/features/home/components/TradeCalendar';
import TradeCard from '@/features/home/components/TradeCard';
import { Trade, TradeType } from '@/features/home/types';

const trades: Trade[] = [
  {
    id: 1,
    date: '2026-05-29',
    coinName: '비트코인',
    amount: 1,
    symbol: 'BTC',
    type: 'buy',
    time: '14:32',
    price: 103403000,
    reviewed: false,
  },
  {
    id: 2,
    date: '2026-05-29',
    coinName: '리플',
    amount: 4,
    symbol: 'XRP',
    type: 'sell',
    time: '14:32',
    price: 103403000,
    reviewed: false,
  },
  {
    id: 3,
    date: '2026-05-24',
    coinName: '이더리움',
    amount: 1,
    symbol: 'ETH',
    type: 'buy',
    time: '09:12',
    price: 5200000,
    reviewed: false,
  },
];

const tradeMarks: Record<string, TradeType[]> = {
  '2026-05-18': ['buy'],
  '2026-05-19': ['buy'],
  '2026-05-23': ['sell'],
  '2026-05-24': ['buy', 'sell'],
  '2026-05-28': ['buy', 'sell'],
};

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState('2026-05-01');
  const [selectedDate, setSelectedDate] = useState('2026-05-29');

  const selectedTrades = trades.filter((trade) => trade.date === selectedDate);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <Logo width={88} height={32} />
          <View style={styles.iconRow}>
            <FontAwesome6 name="bell" size={24} color={COLORS.textPrimary} />
            <FontAwesome name="refresh" size={24} color={COLORS.textPrimary} />
          </View>
        </View>

        <TradeCalendar
          currentDate={currentDate}
          selectedDate={selectedDate}
          tradeMarks={tradeMarks}
          onMonthChange={setCurrentDate}
          onDateSelect={setSelectedDate}
        />

        <View style={styles.tradeSection}>
          <Text style={styles.tradeTitle}>
            {`${parseInt(selectedDate.slice(5, 7))}월 ${parseInt(selectedDate.slice(8, 10))}일 거래`}
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
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },

  tradeSection: {
    marginTop: 20,
  },

  tradeTitle: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Medium',
    marginLeft: 4,
    marginBottom: 12,
  },

  emptyCard: {
    backgroundColor: COLORS.box,
    borderRadius: 8,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
  },
});
