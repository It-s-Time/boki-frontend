import { COLORS } from '@/shared/constants/colors';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PrincipleSet } from '../types';

type Props = {
  set: PrincipleSet;
  selected: boolean;
  onPress: () => void;
};

export default function PrincipleSetCard({ set, selected, onPress }: Props) {
  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{set.name}</Text>
      </View>
      <View style={styles.descRow}>
        <Text style={styles.description} numberOfLines={1}>
          {set.description}
        </Text>
        <Text style={styles.createdAt}>{set.createdAt} 생성</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.badges}>
        <View style={styles.buyBadge}>
          <View style={styles.buyDot} />
          <Text style={styles.buyBadgeText}>매수 원칙 {set.buyCount}개</Text>
        </View>
        <View style={styles.sellBadge}>
          <View style={styles.sellDot} />
          <Text style={styles.sellBadgeText}>매도 원칙 {set.sellCount}개</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.box,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  cardSelected: {
    backgroundColor: '#E4EBFB',
  },

  header: {
    marginBottom: 4,
  },

  name: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  descRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  description: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    marginRight: 8,
  },

  createdAt: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    flexShrink: 0,
  },

  divider: {
    height: 0.5,
    backgroundColor: '#D0D0D1',
    marginBottom: 12,
  },

  badges: {
    flexDirection: 'row',
    gap: 8,
  },

  buyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#D0D0D1',
    backgroundColor: '#FFF',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 6,
  },

  buyDot: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS.buy,
  },

  buyBadgeText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },

  sellBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#D0D0D1',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 6,
  },

  sellDot: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS.sell,
  },

  sellBadgeText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },
});
