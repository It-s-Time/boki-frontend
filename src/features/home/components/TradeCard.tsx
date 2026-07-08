import { COLORS_NEW } from '@/shared/constants/colors';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Trade } from '../types';

const COIN_ICONS: Record<string, number> = {
  BTC: require('../../../../assets/icons/main/bitcoin.png'),
  XRP: require('../../../../assets/icons/main/ripple.png'),
};

type Props = {
  trade: Trade;
};

export default function TradeCard({ trade }: Props) {
  const router = useRouter();

  const handleReview = () => {
    if (trade.reviewed) return;
    router.push({
      pathname: '/review/select-principle-set',
      params: {
        tradeId: trade.id,
        coinName: trade.coinName,
        symbol: trade.symbol,
        amount: trade.amount,
        tradeType: trade.type,
        time: trade.time,
        price: trade.price,
      },
    });
  };

  const icon = COIN_ICONS[trade.symbol];

  return (
    <View style={styles.tradeCard}>
      <View style={styles.iconBadge}>
        {icon ? (
          <Image source={icon} style={styles.iconImage} resizeMode="contain" />
        ) : (
          <Text style={styles.iconFallbackText}>{trade.symbol}</Text>
        )}
      </View>

      <View style={styles.infoColumn}>
        <Text style={styles.tradeNameRow}>
          <Text style={styles.coinName}>{trade.coinName}</Text>
          <Text style={styles.coinAmount}>
            {' '}
            · {trade.amount}
            {trade.symbol}
          </Text>
        </Text>

        <Text style={styles.tradeInfo}>
          {trade.time} · {trade.price.toLocaleString()}원 ·{' '}
          <Text
            style={{
              color: trade.type === 'buy' ? COLORS_NEW.buy : COLORS_NEW.sell,
              fontFamily: 'Pretendard-Medium',
            }}
          >
            {trade.type === 'buy' ? '매수' : '매도'}
          </Text>
        </Text>
      </View>

      <Pressable style={styles.reviewButton} onPress={handleReview}>
        <Entypo
          name="chevron-thin-right"
          size={18}
          color={COLORS_NEW.textPrimary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tradeCard: {
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 20,
    padding: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: COLORS_NEW.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconImage: {
    width: 40,
    height: 16,
  },

  iconFallbackText: {
    fontSize: 12,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Medium',
  },

  infoColumn: {
    flex: 1,
  },

  tradeNameRow: {
    marginBottom: 6,
  },

  coinName: {
    fontSize: 16,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  coinAmount: {
    fontSize: 16,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },

  tradeInfo: {
    fontSize: 14,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    letterSpacing: -0.5,
  },

  reviewButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS_NEW.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
