import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { COLORS_NEW } from '@/shared/constants/colors';
import { keepWordsTogether } from '@/shared/utils/text';
import {
  PRINCIPLE_SETS,
  PRINCIPLE_ILLUSTRATIONS,
} from '@/features/review/data';
import { Principle } from '@/features/review/types';

const CARD_WIDTH = 250;
const CARD_HEIGHT = 350;
const CARD_GAP = 16;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const CAROUSEL_PADDING = 20;
const ILLUSTRATION_BOX = 150;
const SCREEN_HORIZONTAL_PADDING = 24;

const CAROUSEL_HOLD_MS = 200;
const CAROUSEL_ANTICIPATION_OFFSET = 8;
const CAROUSEL_ANTICIPATION_DURATION = 160;

const SHORT_TERM_SET =
  PRINCIPLE_SETS.find((s) => s.id === 'short-term') ?? PRINCIPLE_SETS[0];
const BUY_PRINCIPLES = SHORT_TERM_SET.principles
  .filter((p) => p.type === 'buy')
  .sort((a, b) => a.order - b.order);

interface Props {
  active: boolean;
  height: number | null;
}

// Auto-advances through the buy principles, holding on each card before
// elastically sliding to the next, then wraps back to the first.
export default function PrincipleReviewCarousel({ active, height }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const carouselViewportWidth = windowWidth - SCREEN_HORIZONTAL_PADDING * 2;
  const carouselX = useRef(new Animated.Value(0)).current;

  const carouselCenterOffset =
    (carouselViewportWidth - CARD_WIDTH) / 2 - CAROUSEL_PADDING;

  // A single Animated.loop(Animated.sequence(...)) is handed to the native
  // driver up front, so the hold/slide/hold/slide/.../return cycle keeps
  // running natively and doesn't depend on the JS thread ticking a timer
  // (e.g. setInterval) to kick off each step. carouselViewportWidth comes
  // from useWindowDimensions rather than an onLayout callback, since
  // onLayout was found to never fire for this box.
  useEffect(() => {
    if (!active) {
      carouselX.setValue(carouselCenterOffset);
      return;
    }

    const targets = BUY_PRINCIPLES.map(
      (_, k) => carouselCenterOffset - CARD_STEP * k,
    );
    carouselX.setValue(targets[0]);

    if (targets.length <= 1) return;

    // Each transition winds up with a small pull in the opposite direction
    // before springing to the target, so the motion reads as elastic rather
    // than a flat linear slide.
    const buildTransition = (from: number, to: number) => {
      const direction = to > from ? 1 : -1;
      return [
        Animated.timing(carouselX, {
          toValue: from - direction * CAROUSEL_ANTICIPATION_OFFSET,
          duration: CAROUSEL_ANTICIPATION_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(carouselX, {
          toValue: to,
          bounciness: 5,
          speed: 10,
          useNativeDriver: true,
        }),
      ];
    };

    const steps: Animated.CompositeAnimation[] = [];
    for (let k = 1; k < targets.length; k++) {
      steps.push(
        Animated.delay(CAROUSEL_HOLD_MS),
        ...buildTransition(targets[k - 1], targets[k]),
      );
    }
    steps.push(
      Animated.delay(CAROUSEL_HOLD_MS),
      ...buildTransition(targets[targets.length - 1], targets[0]),
    );

    const loop = Animated.loop(Animated.sequence(steps));
    loop.start();
    return () => loop.stop();
  }, [active, carouselX, carouselViewportWidth, carouselCenterOffset]);

  // 옆 스텝(PrincipleSetPreviewList)에서 측정된 높이를 그대로 물려받다 보니,
  // 그 값이 카드 실제 높이보다 작게 나오는 화면(작은 기기/큰 시스템 폰트)에서는
  // overflow:hidden에 카드가 잘려 보였다. 최소 카드 높이는 항상 보장한다.
  const groupHeight = height
    ? Math.max(height, CARD_HEIGHT + CAROUSEL_PADDING * 2)
    : null;

  return (
    <View style={[styles.carouselGroupWrap, groupHeight ? { height: groupHeight } : null]}>
      <Animated.View
        style={[styles.carouselRow, { transform: [{ translateX: carouselX }] }]}
      >
        {BUY_PRINCIPLES.map((principle, i) => (
          <SessionPreviewCard key={i} principle={principle} />
        ))}
      </Animated.View>
    </View>
  );
}

function SessionPreviewCard({ principle }: { principle: Principle }) {
  const illustration = PRINCIPLE_ILLUSTRATIONS.buy[principle.order];
  const scale = illustration ? ILLUSTRATION_BOX / illustration.height : 1;

  return (
    <View style={styles.previewCard}>
      <Text style={styles.previewCardText} lineBreakStrategyIOS="hangul-word">
        {keepWordsTogether(principle.content)}
      </Text>
      <View style={styles.previewIllustrationWrap}>
        {illustration && (
          <illustration.Icon
            width={illustration.width * scale}
            height={illustration.height * scale}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselGroupWrap: {
    backgroundColor: COLORS_NEW.lightGray,
    borderRadius: 20,
    paddingHorizontal: CAROUSEL_PADDING,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  carouselRow: {
    flexDirection: 'row',
  },
  previewCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: CARD_GAP,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCardText: {
    fontSize: 18,
    letterSpacing: -0.72,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  previewIllustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
