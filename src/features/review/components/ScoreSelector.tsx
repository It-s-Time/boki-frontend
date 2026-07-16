import { COLORS_NEW } from '@/shared/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface Props {
  value: number | null;
  onChange: (n: number) => void;
}

const SCORES = [1, 2, 3, 4, 5];

export default function ScoreSelector({ value, onChange }: Props) {
  return (
    <View>
      <LinearGradient
        colors={['#DCE9FB', '#ECEAF1', '#FBDFDD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.track}
      >
        {SCORES.map((n) => (
          <Pressable
            key={n}
            style={[styles.dot, value === n && styles.dotSelected]}
            onPress={() => onChange(n)}
          />
        ))}
      </LinearGradient>

      <View style={styles.labels}>
        <Text style={styles.label}>미흡</Text>
        <Text style={styles.label}>보통</Text>
        <Text style={styles.label}>완벽</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 999,
    padding: 8,
    height: 44,
  },

  dot: {
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  dotSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },

  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 2,
  },

  label: {
    fontSize: 14,
    letterSpacing: -0.52,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },
});
