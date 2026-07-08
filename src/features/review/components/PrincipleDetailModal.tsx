import { COLORS_NEW } from '@/shared/constants/colors';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BottomSheetModal from '@/shared/components/BottomSheetModal';
import { PrincipleSet } from '../types';

interface Props {
  set: PrincipleSet;
  type: 'buy' | 'sell' | null;
  onClose: () => void;
}

export default function PrincipleDetailModal({ set, type, onClose }: Props) {
  const isBuy = type === 'buy';
  const principles = set.principles.filter((p) => p.type === type);

  return (
    <BottomSheetModal
      visible={type !== null}
      onClose={onClose}
      sheetStyle={styles.sheet}
    >
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>{set.name}</Text>
        <View
          style={[
            styles.typeBadge,
            isBuy ? styles.buyBadge : styles.sellBadge,
          ]}
        >
          <Text
            style={[
              styles.typeBadgeText,
              {
                color: isBuy ? COLORS_NEW.buy : COLORS_NEW.sell,
              },
            ]}
          >
            {isBuy ? '매수' : '매도'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.principleList}
        contentContainerStyle={styles.principleListContent}
        showsVerticalScrollIndicator={false}
      >
        {principles.map((p) => (
          <View key={p.id} style={styles.principleItem}>
            <Text style={styles.principleContent}>{p.content}</Text>
          </View>
        ))}
      </ScrollView>

      <Pressable style={styles.confirmButton} onPress={onClose}>
        <Text style={styles.confirmText}>닫기</Text>
      </Pressable>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingBottom: 32,
    maxHeight: '75%',
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  sheetTitle: {
    fontSize: 24,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  typeBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  buyBadge: {
    backgroundColor: COLORS_NEW.lightRed,
  },

  sellBadge: {
    backgroundColor: COLORS_NEW.lightBlue,
  },

  typeBadgeText: {
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },

  principleList: {
    marginBottom: 24,
  },

  principleListContent: {
    gap: 16,
  },

  principleItem: {
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  principleContent: {
    fontSize: 18,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
  },

  confirmButton: {
    marginTop: 16,
    backgroundColor: COLORS_NEW.fab,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },

  confirmText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },
});
