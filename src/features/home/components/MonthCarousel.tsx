import { useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import type { DateData } from 'react-native-calendars';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { COLORS_NEW } from '@/shared/constants/colors';
import { shiftYearMonth } from '@/features/trade/utils';

const DAY_SIZE = 44;

type DayState = 'selected' | 'disabled' | 'inactive' | 'today' | '';

// How far (as a fraction of one pane's width) or how fast a drag has to go
// before it's treated as "the user wants the next/prev month" rather than a
// drag that should spring back to the current one.
const SWIPE_COMMIT_DISTANCE_RATIO = 0.35;
const SWIPE_COMMIT_VELOCITY = 800; // px/s
const SNAP_SPRING = { damping: 20, stiffness: 200, mass: 0.7 };
const COMMIT_SPRING = { damping: 22, stiffness: 210, mass: 0.8 };

export type TradeMarks = Record<
  string,
  { buyCount: number; sellCount: number }
>;

export type MonthWindowMarks = {
  prev: TradeMarks;
  current: TradeMarks;
  next: TradeMarks;
};

type Props = {
  currentDate: string;
  selectedDate: string;
  marks: MonthWindowMarks;
  onMonthChange: (date: string) => void;
  onDateSelect: (date: string) => void;
};

function shiftMonthString(yearMonth: string, delta: number) {
  const year = parseInt(yearMonth.slice(0, 4), 10);
  const month = parseInt(yearMonth.slice(5, 7), 10);
  const shifted = shiftYearMonth(year, month, delta);
  return `${shifted.year}-${String(shifted.month).padStart(2, '0')}`;
}

export default function MonthCarousel({
  currentDate,
  selectedDate,
  marks,
  onMonthChange,
  onDateSelect,
}: Props) {
  const centerYM = currentDate.slice(0, 7);
  const prevYM = shiftMonthString(centerYM, -1);
  const nextYM = shiftMonthString(centerYM, 1);

  const translateX = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const isAnimatingCommit = useSharedValue(false);

  // The single place translateX ever snaps back to 0 — synchronized (via
  // useLayoutEffect, so it lands in the same commit/paint) with whichever
  // render re-derives prev/center/next from a new `currentDate`. This fires
  // for both a completed swipe and a picker jump; either way, by the time
  // this runs the panes already reflect the new center month, so resetting
  // here can never show a stale month. Doing this reset any earlier (e.g.
  // right when the commit spring settles, before `onMonthChange` has
  // propagated back down) is what caused the old-month flash: translateX
  // would hit 0 while the panes were still keyed to the pre-swipe months.
  useLayoutEffect(() => {
    translateX.value = 0;
  }, [currentDate, translateX]);

  const commitMonthChange = (direction: 'prev' | 'next') => {
    onMonthChange(`${direction === 'prev' ? prevYM : nextYM}-01`);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onUpdate((event) => {
      if (isAnimatingCommit.value) return;
      const width = containerWidth.value;
      translateX.value = Math.max(-width, Math.min(width, event.translationX));
    })
    .onEnd((event) => {
      const width = containerWidth.value;
      if (width <= 0) return;

      const pastDistance =
        Math.abs(event.translationX) > width * SWIPE_COMMIT_DISTANCE_RATIO;
      const pastVelocity = Math.abs(event.velocityX) > SWIPE_COMMIT_VELOCITY;

      if (!pastDistance && !pastVelocity) {
        translateX.value = withSpring(0, SNAP_SPRING);
        return;
      }

      const direction = event.translationX > 0 ? 'prev' : 'next';
      isAnimatingCommit.value = true;
      translateX.value = withSpring(
        direction === 'prev' ? width : -width,
        COMMIT_SPRING,
        (finished) => {
          isAnimatingCommit.value = false;
          if (!finished) return;
          // Leave translateX at ±width (still showing the settled
          // prev/next pane) — the useLayoutEffect above resets it to 0
          // once `onMonthChange` propagates back down and the panes are
          // re-keyed to the new center month, not before.
          runOnJS(commitMonthChange)(direction);
        },
      );
    });

  const animatedTrackStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value - containerWidth.value }],
  }));

  const commonCalendarProps = {
    renderHeader: () => null,
    hideArrows: true,
    hideExtraDays: true,
    enableSwipeMonths: false,
    theme: CALENDAR_THEME,
    style: styles.calendar,
  } as const;

  return (
    <View style={styles.card}>
      <GestureDetector gesture={pan}>
        <View
          style={styles.viewport}
          onLayout={(event) => {
            containerWidth.value = event.nativeEvent.layout.width;
          }}
        >
          <Animated.View style={[styles.track, animatedTrackStyle]}>
            <View style={styles.pane}>
              <Calendar
                key={prevYM}
                current={`${prevYM}-01`}
                {...commonCalendarProps}
                dayComponent={makeDayComponent(
                  marks.prev,
                  selectedDate,
                  onDateSelect,
                )}
              />
            </View>
            <View style={styles.pane}>
              <Calendar
                key={centerYM}
                current={`${centerYM}-01`}
                {...commonCalendarProps}
                dayComponent={makeDayComponent(
                  marks.current,
                  selectedDate,
                  onDateSelect,
                )}
              />
            </View>
            <View style={styles.pane}>
              <Calendar
                key={nextYM}
                current={`${nextYM}-01`}
                {...commonCalendarProps}
                dayComponent={makeDayComponent(
                  marks.next,
                  selectedDate,
                  onDateSelect,
                )}
              />
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

// Factory (not a component) so each of the 3 panes gets a dayComponent
// closed over its own month's marks — the render logic itself is unchanged
// from the single-Calendar version this replaced.
function makeDayComponent(
  tradeMarks: TradeMarks,
  selectedDate: string,
  onDateSelect: (date: string) => void,
) {
  return function Day({ date, state }: { date?: DateData; state?: DayState }) {
    if (!date) return null;

    const dateString = date.dateString;
    const isSelected = dateString === selectedDate;
    const dayMark = tradeMarks[dateString];
    const isDisabled = state === 'disabled';
    const hasBuy = (dayMark?.buyCount ?? 0) > 0;
    const hasSell = (dayMark?.sellCount ?? 0) > 0;
    const isMixed = hasBuy && hasSell;
    const hasDot = hasBuy || hasSell;

    const dayBoxColorStyle = isSelected
      ? styles.selectedDayBox
      : isMixed
        ? null
        : hasBuy
          ? { backgroundColor: COLORS_NEW.lightRed }
          : hasSell
            ? { backgroundColor: COLORS_NEW.lightBlue }
            : styles.emptyDayBox;

    return (
      <Pressable
        disabled={isDisabled}
        onPress={() => onDateSelect(dateString)}
        style={[styles.dayBox, dayBoxColorStyle]}
      >
        {isMixed && !isSelected && !isDisabled && (
          <Svg
            width={DAY_SIZE}
            height={DAY_SIZE}
            style={StyleSheet.absoluteFillObject}
          >
            <Defs>
              <RadialGradient
                id={`mixedGradient-${dateString}`}
                cx="50%"
                cy="50%"
                r="50%"
              >
                <Stop offset="0%" stopColor={COLORS_NEW.lightRed} />
                <Stop offset="40%" stopColor={COLORS_NEW.lightRed} />
                <Stop offset="100%" stopColor={COLORS_NEW.lightBlue} />
              </RadialGradient>
            </Defs>
            <Circle
              cx={DAY_SIZE / 2}
              cy={DAY_SIZE / 2}
              r={DAY_SIZE / 2}
              fill={`url(#mixedGradient-${dateString})`}
            />
          </Svg>
        )}

        <Text
          style={[
            styles.dayText,
            isDisabled && styles.hiddenDayText,
            !hasDot && styles.noDotText,
            isSelected && styles.selectedDayText,
          ]}
        >
          {date.day}
        </Text>
      </Pressable>
    );
  };
}

const CALENDAR_THEME = {
  backgroundColor: COLORS_NEW.background,
  calendarBackground: COLORS_NEW.background,
  textSectionTitleColor: COLORS_NEW.textPrimary,
  ...({
    'stylesheet.calendar.header': {
      dayHeader: {
        marginTop: 2,
        marginBottom: 7,
        width: DAY_SIZE,
        textAlign: 'center',
        fontSize: 16,
        letterSpacing: -0.64,
        fontFamily: 'Pretendard-SemiBold',
        color: COLORS_NEW.textPrimary,
      },
    },
  } as object),
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS_NEW.background,
    borderRadius: 8,
  },

  viewport: {
    width: '100%',
    overflow: 'hidden',
  },

  track: {
    flexDirection: 'row',
    width: '300%',
  },

  pane: {
    flex: 1,
  },

  calendar: {
    borderRadius: 8,
    paddingVertical: 8,
  },

  dayBox: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DAY_SIZE / 2,
    overflow: 'hidden',
  },

  emptyDayBox: {
    backgroundColor: COLORS_NEW.lightGray,
  },

  selectedDayBox: {
    backgroundColor: '#000000',
  },

  dayText: {
    fontSize: 18,
    letterSpacing: -0.72,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },

  selectedDayText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },

  hiddenDayText: {
    color: 'transparent',
  },

  noDotText: {
    color: '#99A1AF',
    fontFamily: 'Pretendard-Light',
  },
});
