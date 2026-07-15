import { COLORS_NEW } from '@/shared/constants/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { Trade } from '@/features/trade/types';
import { COIN_NAMES } from '@/features/trade/constants';
import TradeDetailModal from '@/features/trade/components/TradeDetailModal';

const COIN_ICONS: Record<string, number> = {
  BTC: require('../../../../assets/icons/main/bitcoin.png'),
  XRP: require('../../../../assets/icons/main/ripple.png'),
};

type Props = {
  trade: Trade;
};

function formatTime(tradedAt: string) {
  const date = new Date(tradedAt);
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`;
}

export default function TradeCard({ trade }: Props) {
  const router = useRouter();
  const [detailVisible, setDetailVisible] = useState(false);

  const isReviewed = trade.reviewStatus === 'COMPLETED';
  const coinName = COIN_NAMES[trade.coinType] ?? trade.coinType;
  const time = formatTime(trade.tradedAt);

  const handleReview = () => {
    if (isReviewed) {
      router.push({
        pathname: '/review/ai-report',
        params: { tradeId: trade.tradeId },
      });
      return;
    }
    router.push({
      pathname: '/review/select-principle-set',
      params: {
        tradeId: trade.tradeId,
        coinName,
        symbol: trade.coinType,
        amount: trade.quantity,
        tradeType: trade.tradeType === 'BUY' ? 'buy' : 'sell',
        time,
        price: trade.price,
      },
    });
  };

  const icon = COIN_ICONS[trade.coinType];

  return (
    <View style={styles.tradeCard}>
      <Pressable
        style={styles.detailArea}
        onPress={() => setDetailVisible(true)}
      >
        <View style={styles.iconBadge}>
          {icon ? (
            <Image
              source={icon}
              style={styles.iconImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.iconFallbackText}>{trade.coinType}</Text>
          )}
        </View>

        <View style={styles.infoColumn}>
          <Text style={styles.tradeNameRow}>
            <Text style={styles.coinName}>{coinName}</Text>
            <Text style={styles.coinAmount}>
              {' '}
              · {trade.quantity}
              {trade.coinType}
            </Text>
          </Text>

          <Text style={styles.tradeInfo}>
            {trade.price.toLocaleString()}원 ·{' '}
            <Text
              style={{
                color:
                  trade.tradeType === 'BUY' ? COLORS_NEW.buy : COLORS_NEW.sell,
                fontFamily: 'Pretendard-Medium',
              }}
            >
              {trade.tradeType === 'BUY' ? '매수' : '매도'}
            </Text>
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={[styles.reviewButton, isReviewed && styles.reviewButtonDone]}
        onPress={handleReview}
      >
        {isReviewed ? (
          <AntDesign name="check" size={20} color={COLORS_NEW.background} />
        ) : (
          <Entypo
            name="chevron-thin-right"
            size={18}
            color={COLORS_NEW.textPrimary}
          />
        )}
      </Pressable>

      <TradeDetailModal
        visible={detailVisible}
        trade={trade}
        onClose={() => setDetailVisible(false)}
      />
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

  detailArea: {
    flex: 1,
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
    letterSpacing: -0.48,
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
    letterSpacing: -0.64,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  coinAmount: {
    fontSize: 16,
    letterSpacing: -0.64,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },

  tradeInfo: {
    fontSize: 14,
    letterSpacing: -0.56,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },

  reviewButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS_NEW.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reviewButtonDone: {
    backgroundColor: COLORS_NEW.reviewed,
  },
});
