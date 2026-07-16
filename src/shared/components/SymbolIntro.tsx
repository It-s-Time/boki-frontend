import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS_NEW } from '@/shared/constants/colors';
import { SYMBOL_DARK } from './SymbolSpinner';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ORANGE = COLORS_NEW.reviewed;

// 1단계: N, NE, E(dark) + S, SW, W(orange) 6개가 먼저 나타나고
// 2단계: SE, NW(dark) 2개가 뒤이어 나타나 8개 다리가 완성됨
const LEGS = [
  {
    d: 'M31.4994 -0.000152588H25.7694V31.4998H31.4994V-0.000152588Z',
    color: SYMBOL_DARK,
    stage: 0,
  }, // N
  {
    d: 'M57.2826 4.06182L53.2308 0.0101013L26.6295 26.6115L30.6812 30.6632L57.2826 4.06182Z',
    color: SYMBOL_DARK,
    stage: 0,
  }, // NE
  {
    d: 'M57.2401 31.4994V25.7694L25.7401 25.7694V31.4994H57.2401Z',
    color: SYMBOL_DARK,
    stage: 0,
  }, // E
  {
    d: 'M53.2001 57.2825L57.2518 53.2308L39.2418 35.2208L35.1901 39.2725L53.2001 57.2825Z',
    color: SYMBOL_DARK,
    stage: 1,
  }, // SE
  {
    d: 'M31.4994 25.7694H25.7694V57.2694H31.4994V25.7694Z',
    color: ORANGE,
    stage: 0,
  }, // S
  {
    d: 'M30.6825 30.6502L26.6307 26.5985L0.00816637 53.2211L4.05989 57.2728L30.6825 30.6502Z',
    color: ORANGE,
    stage: 0,
  }, // SW
  {
    d: 'M31.4706 31.4994V25.7694L-0.0294189 25.7694V31.4994H31.4706Z',
    color: ORANGE,
    stage: 0,
  }, // W
  {
    d: 'M18.0277 22.0706L22.0795 18.0189L4.06946 0.00888146L0.0177367 4.0606L18.0277 22.0706Z',
    color: SYMBOL_DARK,
    stage: 1,
  }, // NW
];

interface Props {
  size?: number;
  onFinish?: () => void;
}

export default function SymbolIntro({ size = 96, onFinish }: Props) {
  const stage0 = useRef(new Animated.Value(0)).current;
  const stage1 = useRef(new Animated.Value(0)).current;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(stage0, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.delay(600),
      Animated.timing(stage1, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.delay(600),
    ]);

    // finished가 true일 때만 완료 처리 (재렌더로 애니메이션이 중간에
    // 끊기면 RN Animated가 finished:false로 콜백을 즉시 호출하기 때문)
    animation.start(({ finished }) => {
      if (finished) onFinishRef.current?.();
    });

    return () => animation.stop();
  }, [stage0, stage1]);

  return (
    <Svg width={size} height={size} viewBox="0 0 58 58" fill="none">
      {LEGS.map((leg, i) => (
        <AnimatedPath
          key={i}
          d={leg.d}
          fill={leg.color}
          opacity={leg.stage === 0 ? stage0 : stage1}
        />
      ))}
      <Path
        d="M31.4999 31.4994V25.7694H25.7699V31.4994H31.4999Z"
        fill="white"
      />
    </Svg>
  );
}
