import { COLORS } from '@/shared/constants/colors';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PrincipleSet } from '../types';
import PrincipleDetailModal from './PrincipleDetailModal';

type Props = {
  set: PrincipleSet;
  selected: boolean;
  onPress: () => void;
};

export default function PrincipleSetCard({ set, selected, onPress }: Props) {
  const [modalType, setModalType] = useState<'buy' | 'sell' | null>(null);

  return (
    <>
      <Pressable
        style={[styles.card, selected && styles.cardSelected]}
        onPress={onPress}
      >
        <View style={styles.containerRow}>
          <View style={styles.radioWrapper}>
            <View style={styles.radio}>
              {selected && (
                <Ionicons
                  name="checkmark"
                  size={12}
                  color={COLORS.textPrimary}
                />
              )}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View>
              <Text style={styles.name}>{set.name}</Text>
              <Text style={styles.description} numberOfLines={1}>
                {set.description}
              </Text>
              <Text style={styles.createdAt}>{set.createdAt}&nbsp;생성</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.badges}>
              <Pressable
                style={styles.badge}
                onPress={(e) => {
                  e.stopPropagation();
                  setModalType('buy');
                }}
              >
                <View style={styles.buyIconBox}>
                  <Ionicons
                    name="trending-up"
                    size={14}
                    color={COLORS.textPrimary}
                  />
                </View>
                <Text style={styles.badgeText}>매수 원칙 {set.buyCount}개</Text>
                <Entypo
                  name="chevron-thin-right"
                  size={16}
                  color={COLORS.textSecondary}
                />
              </Pressable>
              <Pressable
                style={styles.badge}
                onPress={(e) => {
                  e.stopPropagation();
                  setModalType('sell');
                }}
              >
                <View style={styles.sellIconBox}>
                  <Ionicons
                    name="trending-down"
                    size={14}
                    color={COLORS.textPrimary}
                  />
                </View>
                <Text style={styles.badgeText}>
                  매도 원칙 {set.sellCount}개
                </Text>
                <Entypo
                  name="chevron-thin-right"
                  size={16}
                  color={COLORS.textSecondary}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>

      <PrincipleDetailModal
        set={set}
        type={modalType}
        onClose={() => setModalType(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.box,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  cardSelected: {
    backgroundColor: COLORS.primaryLight,
  },

  containerRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },

  radioWrapper: {
    marginTop: 4,
  },

  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 4,
  },

  description: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 16,
  },

  createdAt: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 16,
  },

  divider: {
    height: 1,
    backgroundColor: '#D0D0D1',
  },

  badges: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },

  badge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.box,
    borderWidth: 1,
    borderColor: '#D0D0D1',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 10,
  },

  buyIconBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS.buy,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sellIconBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS.sell,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },

});
