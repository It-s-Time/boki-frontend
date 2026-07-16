import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS_NEW } from '@/shared/constants/colors';
import { PRINCIPLE_SETS } from '@/features/review/data';
import { PrincipleSet } from '@/features/review/types';

interface Props {
  active: boolean;
  onHeightChange: (height: number) => void;
}

// Loops a pulse that dims every set except the first and highlights its
// radio/shadow, previewing "this is the one you'd pick" while the screen
// is showing this step.
export default function PrincipleSetPreviewList({
  active,
  onHeightChange,
}: Props) {
  const dimAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      dimAnim.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(dimAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.delay(600),
        Animated.timing(dimAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, dimAnim]);

  const dimOpacity = dimAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.3],
  });

  const radioColor = dimAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D6D6D8', COLORS_NEW.border],
  });

  const selectedShadowOpacity = dimAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.16],
  });

  const selectedElevation = dimAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  return (
    <View
      style={styles.groupWrap}
      onLayout={(e) => onHeightChange(e.nativeEvent.layout.height)}
    >
      {PRINCIPLE_SETS.map((set, i) => (
        <PrincipleSetCardPreview
          key={set.id}
          set={set}
          dimOpacity={i !== 0 ? dimOpacity : 1}
          radioColor={i === 0 ? radioColor : undefined}
          shadowOpacity={i === 0 ? selectedShadowOpacity : undefined}
          elevation={i === 0 ? selectedElevation : undefined}
        />
      ))}
    </View>
  );
}

interface PrincipleSetCardPreviewProps {
  set: PrincipleSet;
  dimOpacity: Animated.AnimatedInterpolation<number> | number;
  radioColor?: Animated.AnimatedInterpolation<string>;
  shadowOpacity?: Animated.AnimatedInterpolation<number>;
  elevation?: Animated.AnimatedInterpolation<number>;
}

function PrincipleSetCardPreview({
  set,
  dimOpacity,
  radioColor,
  shadowOpacity,
  elevation,
}: PrincipleSetCardPreviewProps) {
  return (
    <Animated.View
      style={[
        styles.innerCard,
        shadowOpacity !== undefined && { shadowOpacity, elevation },
      ]}
    >
      <Animated.View style={{ opacity: dimOpacity }}>
        <View style={styles.titleRow}>
          <Text style={styles.cardName}>{set.name}</Text>
          <Animated.View
            style={[styles.radio, radioColor && { borderColor: radioColor }]}
          />
        </View>

        <Text style={styles.cardDescription} numberOfLines={1}>
          {set.description}
        </Text>

        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>매수 원칙 {set.buyCount}개</Text>
            <View style={styles.nextButton}>
              <Entypo
                name="chevron-thin-right"
                size={12}
                color={COLORS_NEW.textPrimary}
              />
            </View>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>매도 원칙 {set.sellCount}개</Text>
            <View style={styles.nextButton}>
              <Entypo
                name="chevron-thin-right"
                size={12}
                color={COLORS_NEW.textPrimary}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  groupWrap: {
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 44,
    gap: 16,
  },
  innerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 18,
    letterSpacing: -0.72,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 11,
    borderWidth: 5,
    borderColor: '#D6D6D8',
  },
  cardDescription: {
    fontSize: 14,
    letterSpacing: -0.56,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 16,
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
    paddingVertical: 4,
    paddingHorizontal: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 14,
    letterSpacing: -0.56,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },
  nextButton: {
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
