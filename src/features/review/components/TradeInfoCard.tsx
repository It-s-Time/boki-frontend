import { COLORS } from '@/shared/constants/colors';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  isBuy: boolean;
  coinName: string;
  amount: string;
  symbol: string;
  time: string;
  formattedPrice: string;
}

export default function TradeInfoCard({
  isBuy,
  coinName,
  amount,
  symbol,
  time,
  formattedPrice,
}: Props) {
  return (
    <View
      style={[styles.card, isBuy ? styles.cardBuy : styles.cardSell]}
    >
      <View style={styles.nameRow}>
        <Text style={styles.coinName}>{coinName}</Text>
        <Text style={styles.amount}>
          {amount} {symbol}
        </Text>
        <Text
          style={[
            styles.tradeType,
            { color: isBuy ? COLORS.buyText : COLORS.sellText },
          ]}
        >
          {isBuy ? '매수' : '매도'}
        </Text>
      </View>
      <Text style={styles.info}>
        {time} · {formattedPrice}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  cardBuy: {
    backgroundColor: '#FFEAEA',
  },
  cardSell: {
    backgroundColor: '#EAF3FF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  coinName: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },
  amount: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },
  tradeType: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
  },
  info: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    letterSpacing: -0.3,
  },
});
