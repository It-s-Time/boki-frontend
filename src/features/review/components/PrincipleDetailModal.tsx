import { COLORS_NEW } from '@/shared/constants/colors';
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
          <View style={styles.handle} />

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
    backgroundColor: COLORS_NEW.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '75%',
  },

  handle: {
    alignSelf: 'center',
    width: 64,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS_NEW.handle,
    marginBottom: 16,
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
