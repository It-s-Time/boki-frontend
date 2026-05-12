import { COLORS } from '@/shared/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
    <Modal
      visible={type !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{set.name}</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.typeBadge}>
            <View style={isBuy ? styles.buyIconBox : styles.sellIconBox}>
              <Ionicons
                name={isBuy ? 'trending-up' : 'trending-down'}
                size={14}
                color={COLORS.textPrimary}
              />
            </View>
            <Text style={styles.typeBadgeText}>
              {isBuy ? '매수' : '매도'} 원칙 {principles.length}개
            </Text>
          </View>

          <View style={styles.divider} />

          <ScrollView
            style={styles.principleList}
            contentContainerStyle={styles.principleListContent}
            showsVerticalScrollIndicator={false}
          >
            {principles.map((p) => (
              <View key={p.id} style={styles.principleItem}>
                <View style={styles.orderCircle}>
                  <Text style={styles.orderText}>{p.order}</Text>
                </View>
                <Text style={styles.principleContent}>{p.content}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.divider} />

          <Pressable style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmText}>확인</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: COLORS.box,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    maxHeight: '75%',
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  sheetTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },

  typeBadgeText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },

  divider: {
    height: 1,
    backgroundColor: '#D0D0D1',
    marginHorizontal: -24,
  },

  principleList: {
    marginVertical: 16,
  },

  principleListContent: {
    gap: 8,
  },

  principleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },

  orderCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  orderText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-SemiBold',
  },

  principleContent: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
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

  confirmButton: {
    marginTop: 16,
    backgroundColor: COLORS.iconBox,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },

  confirmText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },
});
