import { COLORS } from '@/shared/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';

interface Props {
  title: string;
  onBack?: () => void;
  style?: ViewStyle;
}

export default function ScreenHeader({ title, onBack, style }: Props) {
  const router = useRouter();

  return (
    <View style={[styles.header, style]}>
      <Pressable
        onPress={onBack ?? (() => router.back())}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  backButton: {
    padding: 4,
  },

  title: {
    fontSize: 26,
    letterSpacing: -1.04,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },
});
