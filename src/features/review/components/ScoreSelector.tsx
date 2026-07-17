import { COLORS_NEW } from '@/shared/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet, Pressable } from 'react-native';

interface Props {
  value: number | null;
  onChange: (n: number) => void;
  principleKey: string;
}

const SCORES = [1, 2, 3, 4, 5];

const TRACK_PADDING = 8;
const DOT_SIZE = 34;
const TRACK_HEIGHT = 44;
const HIGHLIGHT_SPRING = { damping: 16, stiffness: 180, mass: 0.6 };

export default function ScoreSelector({
  value,
  onChange,
  principleKey,
}: Props) {
  const [trackWidth, setTrackWidth] = useState(0);
  const highlightX = useRef(new Animated.Value(0)).current;
  const highlightOpacity = useRef(new Animated.Value(0)).current;

  const step = (trackWidth - TRACK_PADDING * 2 - DOT_SIZE) / (SCORES.length - 1);
  // 절대 위치 자식은 padding을 무시하고 부모의 border box 기준으로 배치되므로
  // (RN은 CSS와 달리 padding edge가 아닌 border box가 containing block이다),
  // 도트들이 padding만큼 안쪽에서 시작하는 위치를 여기서 직접 더해줘야 한다.
  const targetX = (index: number) => TRACK_PADDING + step * index;

  // 원칙 자체가 바뀔 때만(같은 원칙에서 점수를 고르는 탭은 onPress에서 처리)
  // 해당 원칙에 저장된 점수 위치로 애니메이션 없이 즉시 스냅한다. value를
  // 의존성에 넣지 않는 이유: 넣으면 이 effect가 탭에 의한 value 변화에도
  // 다시 실행되어 onPress의 spring을 즉시 스냅으로 덮어써버린다.
  useEffect(() => {
    if (trackWidth <= 0) return;
    if (value === null) {
      highlightOpacity.setValue(0);
    } else {
      highlightX.setValue(targetX(value - 1));
      highlightOpacity.setValue(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principleKey, trackWidth]);

  const handlePress = (n: number, index: number) => {
    if (trackWidth > 0) {
      if (value === null) {
        highlightX.setValue(targetX(index));
        Animated.timing(highlightOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(highlightX, {
          toValue: targetX(index),
          useNativeDriver: true,
          ...HIGHLIGHT_SPRING,
        }).start();
      }
    }
    onChange(n);
  };

  return (
    <View>
      <LinearGradient
        colors={['#DCE9FB', '#ECEAF1', '#FBDFDD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.track}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        {SCORES.map((n, index) => (
          <Pressable
            key={n}
            style={styles.dot}
            onPress={() => handlePress(n, index)}
          />
        ))}

        <Animated.View
          pointerEvents="none"
          style={[
            styles.highlight,
            {
              opacity: highlightOpacity,
              transform: [{ translateX: highlightX }],
            },
          ]}
        />
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
    padding: TRACK_PADDING,
    height: TRACK_HEIGHT,
  },

  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  highlight: {
    position: 'absolute',
    top: (TRACK_HEIGHT - DOT_SIZE) / 2,
    left: 0,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
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
