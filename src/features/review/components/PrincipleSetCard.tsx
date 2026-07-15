import { COLORS_NEW } from '@/shared/constants/colors';
import Entypo from '@expo/vector-icons/Entypo';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PrincipleSet } from '../types';
import PrincipleDetailModal from './PrincipleDetailModal';

type Props = {
  set: PrincipleSet;
  selected: boolean;
  dimmed: boolean;
  onPress: () => void;
};

export default function PrincipleSetCard({
  set,
  selected,
  dimmed,
  onPress,
}: Props) {
  const [modalType, setModalType] = useState<'buy' | 'sell' | null>(null);

  return (
    <>
      <Pressable
        style={[styles.card, selected && styles.cardSelected]}
        onPress={onPress}
      >
        <View style={[styles.content, dimmed && styles.contentDimmed]}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{set.name}</Text>
            <View style={[styles.radio, selected && styles.radioSelected]} />
          </View>

          <Text style={styles.description} numberOfLines={1}>
            {set.description}
          </Text>

          <View style={styles.badges}>
            <Pressable
              style={styles.badge}
              onPress={(e) => {
                e.stopPropagation();
                setModalType('buy');
              }}
            >
              <Text style={styles.badgeText}>매수 원칙 {set.buyCount}개</Text>
              <View style={styles.nextButton}>
                <Entypo
                  name="chevron-thin-right"
                  size={16}
                  color={COLORS_NEW.textPrimary}
                />
              </View>
            </Pressable>
            <Pressable
              style={styles.badge}
              onPress={(e) => {
                e.stopPropagation();
                setModalType('sell');
              }}
            >
              <Text style={styles.badgeText}>매도 원칙 {set.sellCount}개</Text>
              <View style={styles.nextButton}>
                <Entypo
                  name="chevron-thin-right"
                  size={16}
                  color={COLORS_NEW.textPrimary}
                />
              </View>
            </Pressable>
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
    backgroundColor: COLORS_NEW.background,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderColor: COLORS_NEW.lightBorder,
    borderWidth: 1,
  },

  cardSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.02,
    shadowRadius: 20,
    elevation: 4,
  },

  content: {},

  contentDimmed: {
    opacity: 0.5,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  name: {
    fontSize: 20,
    letterSpacing: -0.8,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 5,
    borderColor: '#D6D6D8',
  },

  radioSelected: {
    borderColor: COLORS_NEW.border,
  },

  description: {
    fontSize: 16,
    letterSpacing: -0.64,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 20,
  },

  badges: {
    flexDirection: 'row',
    gap: 12,
  },

  badge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 6,
  },

  badgeText: {
    fontSize: 16,
    letterSpacing: -0.64,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },

  nextButton: {
    width: 28,
    height: 28,
    borderRadius: 22,
    backgroundColor: COLORS_NEW.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
