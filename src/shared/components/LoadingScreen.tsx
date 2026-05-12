import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

const SPINNER_SIZE = 88;
const STROKE_WIDTH = 8;
const RADIUS = (SPINNER_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_LENGTH = CIRCUMFERENCE * 0.22;
const GAP_LENGTH = CIRCUMFERENCE - ARC_LENGTH;

interface Props {
  message?: string;
}

export default function LoadingScreen({ message }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.loadingBlock}>
          <View style={{ width: SPINNER_SIZE, height: SPINNER_SIZE }}>
            <Svg
              width={SPINNER_SIZE}
              height={SPINNER_SIZE}
              style={StyleSheet.absoluteFill}
            >
              <Circle
                cx={SPINNER_SIZE / 2}
                cy={SPINNER_SIZE / 2}
                r={RADIUS}
                stroke="#555555"
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
            </Svg>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Svg width={SPINNER_SIZE} height={SPINNER_SIZE}>
                <Circle
                  cx={SPINNER_SIZE / 2}
                  cy={SPINNER_SIZE / 2}
                  r={RADIUS}
                  stroke={COLORS.primary}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                  strokeDasharray={`${ARC_LENGTH} ${GAP_LENGTH}`}
                  strokeLinecap="round"
                />
              </Svg>
            </Animated.View>
          </View>
        </View>
        {!!message && <Text style={styles.message}>{message}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingBlock: {
    marginTop: 390,
    alignItems: 'center',
  },
  message: {
    marginTop: 40,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
});
