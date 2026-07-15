import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { COLORS_NEW } from '@/shared/constants/colors';
import BackHeader from '@/shared/components/BackHeader';
import PrimaryButton from '@/shared/components/PrimaryButton';
import ProgressBar from '@/features/review/components/ProgressBar';
import DateWheelPicker from '@/shared/components/DateWheelPicker';
import LoadingScreen from '@/shared/components/LoadingScreen';
import { useCreateManualTrade } from '@/features/trade/hooks/useTrades';

const getManualTradeErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; result?: Record<string, string> }
      | undefined;

    const fieldMessages = responseData?.result
      ? Object.values(responseData.result).filter(
          (v): v is string => typeof v === 'string' && v.length > 0,
        )
      : [];

    if (fieldMessages.length > 0) {
      return fieldMessages.join('\n');
    }

    if (responseData?.message) {
      return responseData.message;
    }
  }

  return '저장에 실패했어요, 다시 시도해주세요';
};

const COINS = [
  { symbol: 'BTC', market: 'KRW', name: '비트코인' },
  { symbol: 'XRP', market: 'KRW', name: '리플' },
  { symbol: 'ETH', market: 'KRW', name: '이더리움' },
  { symbol: 'SOL', market: 'KRW', name: '솔라나' },
  { symbol: 'XRP', market: 'BTC', name: '리플' },
  { symbol: 'SOL', market: 'BTC', name: '솔라나' },
  { symbol: 'ETH', market: 'BTC', name: '이더리움' },
  { symbol: 'BTC', market: 'USDT', name: '비트코인' },
  { symbol: 'SOL', market: 'USDT', name: '솔라나' },
  { symbol: 'ETH', market: 'USDT', name: '이더리움' },
  { symbol: 'XRP', market: 'USDT', name: '리플' },
] as const;

const BADGE_COLORS: Record<string, string> = {
  KRW: '#E4EAFA',
  USDT: '#DBF6CD',
  BTC: '#FBD7D7',
};

type TradeType = 'buy' | 'sell';
type Coin = (typeof COINS)[number];
type Step = 'date' | 'coin' | 'tradeType' | 'price';

const STEPS: Step[] = ['date', 'coin', 'tradeType', 'price'];

const onlyDigits = (text: string) => text.replace(/[^0-9]/g, '');
const formatNumber = (digits: string) =>
  digits ? Number(digits).toLocaleString() : '';
const formatDate = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate(),
  ).padStart(2, '0')}`;

export default function ManualInputScreen() {
  const createManualTrade = useCreateManualTrade();

  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  const [tradeDate, setTradeDate] = useState(() => new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [coinSearch, setCoinSearch] = useState('');
  const [showCoinList, setShowCoinList] = useState(false);
  const [tradeType, setTradeType] = useState<TradeType | null>(null);
  const [price, setPrice] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const filteredCoins = COINS.filter(
    (c) =>
      coinSearch === '' ||
      c.symbol.toLowerCase().includes(coinSearch.toLowerCase()) ||
      c.name.includes(coinSearch),
  );

  const handlePriceChange = (text: string) => {
    setPrice(onlyDigits(text));
  };

  const handleTotalAmountChange = (text: string) => {
    setTotalAmount(onlyDigits(text));
  };

  const canProceed =
    step === 'date'
      ? true
      : step === 'coin'
        ? !!selectedCoin
        : step === 'tradeType'
          ? !!tradeType
          : !!price && !!totalAmount;

  const handleNext = () => {
    if (!canProceed) return;
    if (stepIndex === STEPS.length - 1) {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`;
      const date = `${tradeDate.getFullYear()}-${String(tradeDate.getMonth() + 1).padStart(2, '0')}-${String(tradeDate.getDate()).padStart(2, '0')}`;
      const tradedAt = `${date}T${time}:00`;

      createManualTrade.mutate(
        {
          coinType: selectedCoin?.symbol ?? '',
          tradeType: tradeType === 'buy' ? 'BUY' : 'SELL',
          price: Number(price),
          totalAmount: Number(totalAmount),
          tradedAt,
        },
        {
          onSuccess: (trade) => {
            router.replace({
              pathname: '/input/done',
              params: {
                tradeId: String(trade.tradeId),
                coinName: selectedCoin?.name ?? '',
                symbol: selectedCoin?.symbol ?? '',
                amount: String(trade.quantity),
                tradeType: tradeType ?? '',
                price: String(trade.price),
                time,
              },
            });
          },
        },
      );
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    } else {
      router.back();
    }
  };

  if (createManualTrade.isPending) {
    return <LoadingScreen message="거래 내역을 저장하고 있어요" />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {step === 'coin' && showCoinList && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setShowCoinList(false)}
        />
      )}

      <View style={styles.container}>
        <BackHeader title="수동 입력" onBack={handleBack} />

        <View style={styles.progressWrap}>
          <ProgressBar total={STEPS.length} current={stepIndex} />
        </View>

        {step === 'coin' && (
          <View style={styles.coinSection}>
            <View style={styles.coinInputGroup}>
              <Text style={styles.label}>코인 선택</Text>
              <View
                style={[styles.inputBox, showCoinList && styles.inputBoxOpen]}
              >
                <Ionicons
                  name="search-outline"
                  size={20}
                  color={COLORS_NEW.border}
                />
                <TextInput
                  style={[styles.input, { marginLeft: 8 }]}
                  value={coinSearch}
                  onChangeText={(text) => {
                    setCoinSearch(text);
                    setSelectedCoin(null);
                  }}
                  onFocus={() => setShowCoinList(true)}
                  placeholder={
                    selectedCoin
                      ? `${selectedCoin.symbol}/${selectedCoin.market}`
                      : '코인 이름이나 심볼 검색'
                  }
                  placeholderTextColor={
                    selectedCoin ? COLORS_NEW.textPrimary : COLORS_NEW.border
                  }
                />
              </View>
            </View>

            {showCoinList && (
              <View style={styles.coinListPanel}>
                <ScrollView
                  style={styles.coinListScroll}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {filteredCoins.map((item, index) => {
                    const badgeBg =
                      BADGE_COLORS[item.market] ?? COLORS_NEW.lightGray;
                    return (
                      <View key={`${item.symbol}-${item.market}`}>
                        {index > 0 && <View style={styles.itemDivider} />}
                        <Pressable
                          style={styles.coinItem}
                          onPress={() => {
                            setSelectedCoin(item);
                            setCoinSearch('');
                            setShowCoinList(false);
                          }}
                        >
                          <View style={{ flex: 1, gap: 2 }}>
                            <Text style={styles.coinSymbol}>
                              {item.symbol}/{item.market}
                            </Text>
                            <Text style={styles.coinName}>{item.name}</Text>
                          </View>
                          <View
                            style={[styles.badge, { backgroundColor: badgeBg }]}
                          >
                            <Text style={styles.badgeText}>{item.market}</Text>
                          </View>
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {step !== 'coin' && (
          <ScrollView
            style={styles.stepScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {step === 'date' && (
              <View style={styles.section}>
                <Text style={styles.label}>언제 거래하셨나요?</Text>
                <Pressable
                  style={styles.inputBox}
                  onPress={() => setShowDatePicker((v) => !v)}
                >
                  <Text style={styles.input}>{formatDate(tradeDate)}</Text>
                  <View
                    style={[
                      styles.calendarButton,
                      showDatePicker && styles.calendarButtonActive,
                    ]}
                  >
                    <Feather
                      name="calendar"
                      size={20}
                      color={
                        showDatePicker
                          ? COLORS_NEW.background
                          : COLORS_NEW.border
                      }
                    />
                  </View>
                </Pressable>

                {showDatePicker && (
                  <View style={styles.datePickerPanel}>
                    <DateWheelPicker
                      value={tradeDate}
                      onChange={setTradeDate}
                    />
                  </View>
                )}
              </View>
            )}

            {step === 'tradeType' && (
              <View style={styles.section}>
                <Text style={styles.label}>거래 유형</Text>
                <View style={styles.tradeTypeRow}>
                  <Pressable
                    style={[
                      styles.tradeTypeBox,
                      tradeType === 'buy' && styles.tradeTypeBoxBuy,
                    ]}
                    onPress={() => setTradeType('buy')}
                  >
                    <Text
                      style={[
                        styles.tradeTypeText,
                        tradeType === 'buy' && { color: COLORS_NEW.upStrong },
                      ]}
                    >
                      매수
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.tradeTypeBox,
                      tradeType === 'sell' && styles.tradeTypeBoxSell,
                    ]}
                    onPress={() => setTradeType('sell')}
                  >
                    <Text
                      style={[
                        styles.tradeTypeText,
                        tradeType === 'sell' && {
                          color: COLORS_NEW.downStrong,
                        },
                      ]}
                    >
                      매도
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}

            {step === 'price' && (
              <>
                <View style={styles.section}>
                  <Text style={styles.label}>거래 가격 (원)</Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.input}
                      value={formatNumber(price)}
                      onChangeText={handlePriceChange}
                      placeholder="예: 95,000,000"
                      placeholderTextColor={COLORS_NEW.border}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>총 거래 금액</Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.input}
                      value={formatNumber(totalAmount)}
                      onChangeText={handleTotalAmountChange}
                      placeholder="예: 10,000,000"
                      placeholderTextColor={COLORS_NEW.border}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        )}

        {!(step === 'coin' && showCoinList) && (
          <View style={styles.footer}>
            {createManualTrade.isError && (
              <Text style={styles.submitError}>
                {getManualTradeErrorMessage(createManualTrade.error)}
              </Text>
            )}
            <PrimaryButton
              label={stepIndex === STEPS.length - 1 ? '완료' : '다음'}
              onPress={handleNext}
              disabled={!canProceed}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  progressWrap: {
    marginTop: 20,
    marginBottom: 24,
  },
  stepScroll: {
    overflow: 'visible',
  },
  content: {
    paddingBottom: 16,
    gap: 24,
  },
  section: {
    marginTop: 24,
    gap: 16,
  },
  coinSection: {
    flex: 1,
  },
  coinInputGroup: {
    gap: 16,
  },
  label: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 26,
    letterSpacing: -1.04,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS_NEW.background,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
    padding: 0,
    fontSize: 22,
    letterSpacing: -0.88,
  },
  inputBoxOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarButtonActive: {
    backgroundColor: COLORS_NEW.border,
  },
  datePickerPanel: {
    alignSelf: 'flex-end',
    width: '70%',
    backgroundColor: COLORS_NEW.background,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 0.7,
  },
  coinListPanel: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: COLORS_NEW.lightBorder,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  coinListScroll: {
    flex: 1,
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS_NEW.lightBorder,
    marginHorizontal: 16,
  },
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  coinSymbol: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 15,
    letterSpacing: -0.6,
  },
  coinName: {
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    letterSpacing: -0.52,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    letterSpacing: -0.48,
  },
  tradeTypeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tradeTypeBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
  },
  tradeTypeBoxBuy: {
    backgroundColor: COLORS_NEW.lightRed,
    borderColor: COLORS_NEW.lightRed,
  },
  tradeTypeBoxSell: {
    backgroundColor: COLORS_NEW.lightBlue,
    borderColor: COLORS_NEW.lightBlue,
  },
  tradeTypeText: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    letterSpacing: -0.8,
  },
  footer: {
    paddingBottom: 16,
    paddingTop: 12,
  },
  submitError: {
    color: COLORS_NEW.downStrong,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    letterSpacing: -0.56,
    textAlign: 'center',
    marginBottom: 12,
  },
});
