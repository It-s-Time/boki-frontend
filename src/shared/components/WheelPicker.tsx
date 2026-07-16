import { useEffect, useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS_NEW } from '@/shared/constants/colors';

const DEFAULT_ITEM_HEIGHT = 40;
const DEFAULT_VISIBLE_COUNT = 5;

interface Props {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  itemHeight?: number;
  visibleCount?: number;
  highlightVariant?: 'border' | 'fill';
  showHighlight?: boolean;
  fontSize?: number;
}

export default function WheelPicker({
  items,
  selectedIndex,
  onChange,
  style,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  visibleCount = DEFAULT_VISIBLE_COUNT,
  highlightVariant = 'border',
  showHighlight = true,
  fontSize = 20,
}: Props) {
  const ITEM_HEIGHT = itemHeight;
  const PADDING = (ITEM_HEIGHT * (visibleCount - 1)) / 2;
  const scrollRef = useRef<ScrollView>(null);
  const skipNextSync = useRef(false);

  useEffect(() => {
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    scrollRef.current?.scrollTo({
      y: selectedIndex * ITEM_HEIGHT,
      animated: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.max(
      0,
      Math.min(items.length - 1, Math.round(y / ITEM_HEIGHT)),
    );
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
    if (index !== selectedIndex) {
      skipNextSync.current = true;
      onChange(index);
    }
  };

  return (
    <View
      style={[styles.container, { height: ITEM_HEIGHT * visibleCount }, style]}
    >
      {showHighlight && (
        <View
          style={[
            highlightVariant === 'fill'
              ? styles.highlightFill
              : styles.highlightBorder,
            { top: PADDING, height: ITEM_HEIGHT },
          ]}
          pointerEvents="none"
        />
      )}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: PADDING }}
        contentOffset={{ x: 0, y: selectedIndex * ITEM_HEIGHT }}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {items.map((label, index) => (
          <View
            key={`${label}-${index}`}
            style={[styles.item, { height: ITEM_HEIGHT }]}
          >
            <Text
              style={[
                styles.itemText,
                index === selectedIndex && styles.itemTextSelected,
                { fontSize },
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  highlightBorder: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
  },

  highlightFill: {
    position: 'absolute',
    left: 8,
    right: 8,
    borderRadius: 999,
    backgroundColor: COLORS_NEW.lightGray,
  },

  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemText: {
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },

  itemTextSelected: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },
});
