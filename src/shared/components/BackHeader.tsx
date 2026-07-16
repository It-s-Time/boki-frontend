import { COLORS_NEW } from '@/shared/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  title?: string;
  icon?: ReactNode;
  onBack?: () => void;
}

export default function BackHeader({ title, icon, onBack }: Props) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack ?? (() => router.back())}
        style={styles.backButton}
        hitSlop={12}
      >
        {icon ?? (
          <Ionicons name="chevron-back" size={24} color={COLORS_NEW.border} />
        )}
      </Pressable>
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 0,
    width: 52,
    height: 52,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS_NEW.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  title: {
    fontSize: 22,
    letterSpacing: -0.88,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
  },
});
