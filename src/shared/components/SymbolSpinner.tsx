import { useEffect, useMemo } from 'react';
import { Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DARK = '#252930';
const ORANGE = '#EE7A60';

// symbol.svg의 8개 다리를 시계방향(N, NE, E, SE, S, SW, W, NW) 순서로 나열
const LEGS = [
  'M31.4994 -0.000152588H25.7694V31.4998H31.4994V-0.000152588Z',
  'M57.2826 4.06182L53.2308 0.0101013L26.6295 26.6115L30.6812 30.6632L57.2826 4.06182Z',
  'M57.2401 31.4994V25.7694L25.7401 25.7694V31.4994H57.2401Z',
  'M53.2001 57.2825L57.2518 53.2308L39.2418 35.2208L35.1901 39.2725L53.2001 57.2825Z',
  'M31.4994 25.7694H25.7694V57.2694H31.4994V25.7694Z',
  'M30.6825 30.6502L26.6307 26.5985L0.00816637 53.2211L4.05989 57.2728L30.6825 30.6502Z',
  'M31.4706 31.4994V25.7694L-0.0294189 25.7694V31.4994H31.4706Z',
  'M18.0277 22.0706L22.0795 18.0189L4.06946 0.00888146L0.0177367 4.0606L18.0277 22.0706Z',
];

const LEG_COUNT = LEGS.length;
const CYCLE_DURATION = 1600;
const STEP = CYCLE_DURATION / LEG_COUNT;

interface Props {
  size?: number;
}

export default function SymbolSpinner({ size = 60 }: Props) {
  const values = useMemo(() => LEGS.map(() => new Animated.Value(0)), []);

  useEffect(() => {
    const animations = values.map((value, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * STEP),
          // 페이드 없이 즉시 켜짐 ("탁")
          Animated.timing(value, {
            toValue: 1,
            duration: 0,
            useNativeDriver: false,
          }),
          Animated.delay(STEP),
          // 페이드 없이 즉시 꺼짐 ("탁")
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
          Animated.delay((LEG_COUNT - 1 - i) * STEP),
        ]),
      ),
    );
    animations.forEach((animation) => animation.start());
    return () => animations.forEach((animation) => animation.stop());
  }, [values]);

  return (
    <Svg width={size} height={size} viewBox="0 0 58 58" fill="none">
      {LEGS.map((d, i) => (
        <AnimatedPath
          key={i}
          d={d}
          fill={values[i].interpolate({
            inputRange: [0, 1],
            outputRange: [DARK, ORANGE],
          })}
        />
      ))}
      <Path
        d="M31.4999 31.4994V25.7694H25.7699V31.4994H31.4999Z"
        fill="white"
      />
    </Svg>
  );
}
