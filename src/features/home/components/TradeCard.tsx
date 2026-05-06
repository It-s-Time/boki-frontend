import { COLORS } from '@/shared/constants/colors';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Trade } from '../types';

type Props = {
  trade: Trade;
};

export default function TradeCard({ trade }: Props) {
  const router = useRouter();

  const handleReview = () => {
    if (trade.reviewed) return;
    router.push(`/review/select-principle-set?tradeId=${trade.id}`);
  };

  return (
    <View style={styles.tradeCard}>
      <View>
        <View style={styles.tradeNameRow}>
          <Text style={styles.coinName}>{trade.coinName}</Text>
          <Text style={styles.coinAmount}>
            {trade.amount}&nbsp;{trade.symbol}
          </Text>
          <Text
            style={[
              styles.tradeType,
              {
                color:
                  trade.type === 'buy' ? COLORS.buyText : COLORS.sellText,
              },
            ]}
          >
            {trade.type === 'buy' ? '매수' : '매도'}
          </Text>
        </View>

        <Text style={styles.tradeInfo}>
          {trade.time} · {trade.price.toLocaleString()}원
        </Text>
      </View>

      <Pressable style={styles.reviewButton} onPress={handleReview}>
        <Text style={styles.reviewButtonText}>
          {trade.reviewed ? '복기완료' : '복기하기'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tradeCard: {
    backgroundColor: COLORS.box,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  tradeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  coinName: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    marginRight: 8,
  },

  coinAmount: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    marginRight: 8,
  },

  tradeType: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
  },

  tradeInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    letterSpacing: -0.5,
  },

  reviewButton: {
    width: 72,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E9EDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  reviewButtonText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },
});
