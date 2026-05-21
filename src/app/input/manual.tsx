import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';

const COINS = [
  { symbol: 'BTC', market: 'KRW', name: '비트코인' },
  { symbol: 'BTC', market: 'USDT', name: '비트코인' },
  { symbol: 'ETH', market: 'KRW', name: '이더리움' },
  { symbol: 'ETH', market: 'BTC', name: '이더리움' },
  { symbol: 'ETH', market: 'USDT', name: '이더리움' },
  { symbol: 'XRP', market: 'KRW', name: '리플' },
  { symbol: 'SOL', market: 'KRW', name: '솔라나' },
  { symbol: 'DOGE', market: 'KRW', name: '도지코인' },
] as const;

const BADGE_COLORS: Record<string, { bg: string }> = {
  KRW: { bg: '#E4EAFA' },
  USDT: { bg: '#DBF6CD' },
  BTC: { bg: '#FBD7D7' },
};

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/shared/constants/colors';
import ScreenHeader from '@/shared/components/ScreenHeader';
import Button from '@/shared/components/Button';
import Entypo from '@expo/vector-icons/Entypo';

type TradeType = 'buy' | 'sell';

export default function ManualInputScreen() {
  const [date, setDate] = useState('');
  const [coin, setCoin] = useState('');
  const [coinSearch, setCoinSearch] = useState('');
  const [showCoinList, setShowCoinList] = useState(false);
  const [tradeType, setTradeType] = useState<TradeType>('buy');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');

  const filteredCoins = COINS.filter(
    (c) =>
      coinSearch === '' ||
      c.symbol.toLowerCase().includes(coinSearch.toLowerCase()) ||
      c.name.includes(coinSearch),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showCoinList && (
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowCoinList(false)} />
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <ScreenHeader title="수동 입력" onBack={() => router.back()} />
          <View style={styles.divider} />

          {/* 거래 날짜 */}
          <View style={styles.section}>
            <Text style={styles.label}>거래 날짜</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="2026-00-00"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
              />
              <Entypo name="calendar" size={18} color={COLORS.textSecondary} />
            </View>
          </View>

          {/* 코인 선택 */}
          <View style={styles.section}>
            <Text style={styles.label}>코인 선택</Text>
            <View>
              <View
                style={[styles.inputBox, showCoinList && styles.inputBoxOpen]}
              >
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={COLORS.textSecondary}
                />
                <TextInput
                  style={[styles.input, { marginLeft: 8 }]}
                  value={coinSearch}
                  onChangeText={setCoinSearch}
                  onFocus={() => setShowCoinList(true)}
                  placeholder={coin || '코인 이름이나 심볼 검색'}
                  placeholderTextColor={
                    coin ? COLORS.textPrimary : COLORS.textSecondary
                  }
                />
              </View>
              {showCoinList && (
                <View style={styles.coinList}>
                  {filteredCoins.map((item, index) => {
                    const badge = BADGE_COLORS[item.market] ?? {
                      bg: COLORS.button,
                      text: COLORS.textSecondary,
                    };
                    return (
                      <View key={`${item.symbol}-${item.market}`}>
                        {index > 0 && <View style={styles.itemDivider} />}
                        <Pressable
                          style={styles.coinItem}
                          onPress={() => {
                            setCoin(`${item.symbol}/${item.market}`);
                            setCoinSearch('');
                            setShowCoinList(false);
                          }}
                        >
                          <View style={styles.coinIcon} />
                          <View style={{ flex: 1, gap: 2 }}>
                            <Text style={styles.coinSymbol}>
                              {item.symbol}/{item.market}
                            </Text>
                            <Text style={styles.coinName}>{item.name}</Text>
                          </View>
                          <View
                            style={[
                              styles.badge,
                              { backgroundColor: badge.bg },
                            ]}
                          >
                            <Text style={styles.badgeText}>{item.market}</Text>
                          </View>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          {/* 거래 유형 */}
          <View style={styles.section}>
            <Text style={styles.label}>거래 유형</Text>
            <View style={styles.toggleContainer}>
              <Pressable
                style={[
                  styles.toggleButton,
                  tradeType === 'buy' && styles.toggleActive,
                ]}
                onPress={() => setTradeType('buy')}
              >
                <Ionicons
                  name="trending-up-outline"
                  size={18}
                  color={
                    tradeType === 'buy'
                      ? COLORS.textPrimary
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.toggleText,
                    tradeType === 'buy' && styles.toggleTextActive,
                  ]}
                >
                  매수
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleButton,
                  tradeType === 'sell' && styles.toggleActive,
                ]}
                onPress={() => setTradeType('sell')}
              >
                <Ionicons
                  name="trending-down-outline"
                  size={18}
                  color={
                    tradeType === 'sell'
                      ? COLORS.textPrimary
                      : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.toggleText,
                    tradeType === 'sell' && styles.toggleTextActive,
                  ]}
                >
                  매도
                </Text>
              </Pressable>
            </View>
          </View>

          {/* 거래 가격 */}
          <View style={styles.section}>
            <Text style={styles.label}>거래 가격 (원)</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="예: 95,000,000"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* 거래 수량 */}
          <View style={styles.section}>
            <Text style={styles.label}>거래 수량</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="예: 1,000,000"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button label="입력 완료" onPress={() => {}} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 24,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: -24,
    marginBottom: 16,
  },
  section: {
    marginTop: 4,
    gap: 16,
  },
  label: {
    color: '#000',
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.box,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    padding: 0,
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 8,
    backgroundColor: COLORS.button,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 6,
  },
  toggleActive: {
    backgroundColor: COLORS.box,
  },
  toggleText: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
  },
  toggleTextActive: {
    color: COLORS.textPrimary,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
  inputBoxOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  coinList: {
    backgroundColor: COLORS.box,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: COLORS.divider,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: 16,
  },
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.iconBox,
  },
  coinSymbol: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
  },
  coinName: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
  },
});
