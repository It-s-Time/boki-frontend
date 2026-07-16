import { router, Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  Alert,
  Animated,
  PanResponder,
  Pressable,
  View,
  StyleSheet,
} from 'react-native';
import { type ComponentType, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useQueryClient } from '@tanstack/react-query';
import { COLORS_NEW } from '@/shared/constants/colors';
import { syncExchangeTrades } from '@/api/exchange';
import InputOptionsModal from '@/features/input/components/InputOptionsModal';
import SyncSuccessModal from '@/features/input/components/SyncSuccessModal';
import { tradeKeys } from '@/features/trade/hooks/useTrades';
import { useApiStore } from '@/store/apiStore';
import HomeIcon from '../../../assets/icons/home.svg';
import LogIcon from '../../../assets/icons/log2.svg';
import PrincipleIcon from '../../../assets/icons/principle.svg';
import MyIcon from '../../../assets/icons/my.svg';
import AddIcon from '../../../assets/icons/add.svg';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const TAB_BAR_HEIGHT = 52;
const ICON_SIZE = 16;
const HIGHLIGHT_WIDTH = 70;
const HIGHLIGHT_SPRING = { damping: 16, stiffness: 180, mass: 0.6 };

const getSyncErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; code?: string; error?: string }
      | undefined;
    const serverMessage = responseData?.message || responseData?.error;

    if (serverMessage) {
      return responseData?.code
        ? `${serverMessage} (${responseData.code})`
        : serverMessage;
    }

    if (error.response?.status === 401) {
      return '로그인이 만료되었습니다. 다시 로그인해주세요.';
    }

    if (error.response?.status) {
      return `서버 요청에 실패했습니다. (${error.response.status})`;
    }

    if (error.code === 'ECONNABORTED') {
      return '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
    }
  }

  return '잠시 후 다시 시도해주세요.';
};

interface TabIconConfig {
  name: string;
  Icon: ComponentType<{ width?: number; height?: number; color?: string }>;
  width: number;
  height: number;
}

const LEFT_TABS: TabIconConfig[] = [
  { name: 'index', Icon: HomeIcon, width: ICON_SIZE, height: ICON_SIZE },
  { name: 'journal', Icon: LogIcon, width: ICON_SIZE * 0.75, height: ICON_SIZE },
];

const RIGHT_TABS: TabIconConfig[] = [
  {
    name: 'principles',
    Icon: PrincipleIcon,
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  { name: 'mypage', Icon: MyIcon, width: ICON_SIZE, height: ICON_SIZE },
];

function TabPill({
  tabs,
  state,
  navigation,
}: {
  tabs: TabIconConfig[];
  state: BottomTabBarProps['state'];
  navigation: BottomTabBarProps['navigation'];
}) {
  const highlightX = useRef(new Animated.Value(0)).current;
  const contentRef = useRef<View>(null);
  const contentWidth = useRef(0);
  const contentPageX = useRef(0);
  const activeIndex = useRef(0);

  const routes = tabs
    .map((tab) => state.routes.find((r) => r.name === tab.name))
    .filter((route): route is (typeof state.routes)[number] => !!route);
  const focusedIndexInGroup = routes.findIndex(
    (route) => state.routes.indexOf(route) === state.index,
  );
  const [showHighlight, setShowHighlight] = useState(focusedIndexInGroup >= 0);

  // PanResponder is created once (see below) and its handlers close over
  // whatever these were on the first render. Route them through refs kept
  // fresh every render so tapping/dragging after the focused tab changes
  // still sees the current navigation state instead of a stale snapshot.
  const stateRef = useRef(state);
  stateRef.current = state;
  const navigationRef = useRef(navigation);
  navigationRef.current = navigation;
  const routesRef = useRef(routes);
  routesRef.current = routes;

  useEffect(() => {
    setShowHighlight(focusedIndexInGroup >= 0);
  }, [focusedIndexInGroup]);

  const targetX = (index: number, width: number) => {
    const itemWidth = width / tabs.length;
    return itemWidth * index + itemWidth / 2 - HIGHLIGHT_WIDTH / 2;
  };

  const indexFromX = (x: number, width: number) => {
    const itemWidth = width / tabs.length;
    return Math.min(tabs.length - 1, Math.max(0, Math.floor(x / itemWidth)));
  };

  const navigateToIndex = (index: number) => {
    const currentState = stateRef.current;
    const route = routesRef.current[index];
    if (!route) return;
    const isFocused = currentState.routes.indexOf(route) === currentState.index;
    const event = navigationRef.current.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigationRef.current.navigate(route.name);
    }
  };

  const springTo = (index: number) => {
    const width = contentWidth.current;
    if (width <= 0) return;
    Animated.spring(highlightX, {
      toValue: targetX(index, width),
      useNativeDriver: true,
      ...HIGHLIGHT_SPRING,
    }).start();
  };

  useEffect(() => {
    if (focusedIndexInGroup < 0 || contentWidth.current <= 0) return;
    activeIndex.current = focusedIndexInGroup;
    springTo(focusedIndexInGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndexInGroup]);

  const onContentLayout = () => {
    contentRef.current?.measure((_x, _y, width, _height, pageX) => {
      contentWidth.current = width;
      contentPageX.current = pageX;
      if (focusedIndexInGroup < 0) return;
      activeIndex.current = focusedIndexInGroup;
      highlightX.setValue(targetX(focusedIndexInGroup, width));
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const width = contentWidth.current;
        if (width <= 0) return;
        const x = evt.nativeEvent.pageX - contentPageX.current;
        const idx = indexFromX(x, width);
        activeIndex.current = idx;
        setShowHighlight(true);
        springTo(idx);
        navigateToIndex(idx);
      },
      onPanResponderMove: (_evt, gestureState) => {
        const width = contentWidth.current;
        if (width <= 0) return;
        const x = gestureState.moveX - contentPageX.current;
        highlightX.setValue(
          Math.min(width - HIGHLIGHT_WIDTH, Math.max(0, x - HIGHLIGHT_WIDTH / 2)),
        );
        const idx = indexFromX(x, width);
        if (idx !== activeIndex.current) {
          activeIndex.current = idx;
          navigateToIndex(idx);
        }
      },
      onPanResponderRelease: () => springTo(activeIndex.current),
      onPanResponderTerminate: () => springTo(activeIndex.current),
    }),
  ).current;

  return (
    <View style={styles.groupPill}>
      <BlurView intensity={35} tint="light" style={StyleSheet.absoluteFill} />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
        locations={[0, 0.6]}
        style={styles.glassSheen}
      />
      <View
        ref={contentRef}
        style={styles.groupContent}
        onLayout={onContentLayout}
        {...panResponder.panHandlers}
      >
        {showHighlight && (
          <Animated.View
            style={[
              styles.itemHighlight,
              { transform: [{ translateX: highlightX }] },
            ]}
            pointerEvents="none"
          />
        )}
        {tabs.map((tab) => (
          <View key={tab.name} style={styles.groupItem} pointerEvents="none">
            <tab.Icon width={tab.width} height={tab.height} />
          </View>
        ))}
      </View>
    </View>
  );
}

function CustomTabBar({
  state,
  navigation,
  onFabPress,
  isApiConnected,
  isSyncing,
}: BottomTabBarProps & {
  onFabPress: () => void;
  isApiConnected: boolean;
  isSyncing: boolean;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.barContainer,
        {
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.row}>
        <TabPill tabs={LEFT_TABS} state={state} navigation={navigation} />

        <Pressable
          style={styles.fabWrapper}
          onPress={onFabPress}
          disabled={isSyncing}
        >
          <View style={[styles.fab, isSyncing && styles.fabDisabled]}>
            {isApiConnected ? (
              <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
            ) : (
              <AddIcon width={18} height={18} color="#FFFFFF" />
            )}
          </View>
        </Pressable>

        <TabPill tabs={RIGHT_TABS} state={state} navigation={navigation} />
      </View>
    </View>
  );
}

export default function TabLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessVisible, setSyncSuccessVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const isApiConnected = useApiStore((s) => s.isApiConnected);

  const handleFabPress = async () => {
    if (!isApiConnected) {
      setModalVisible(true);
      return;
    }
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      const data = await syncExchangeTrades();

      if (!data.isSuccess) {
        Alert.alert('거래 내역 가져오기 실패', data.message);
        return;
      }

      const syncResult = data.result;
      const syncedTrades = syncResult?.trades ?? [];
      await queryClient.invalidateQueries({ queryKey: tradeKeys.all });

      if (syncedTrades.length > 0) {
        queryClient.setQueryData(tradeKeys.list(), syncedTrades);
      }

      router.replace('/(tabs)');
      const syncedCount = syncResult?.syncedCount ?? syncedTrades.length;
      const skippedCount = syncResult?.skippedCount ?? 0;
      const hasSyncedTrades = syncedCount > 0 || syncedTrades.length > 0;

      if (!hasSyncedTrades && skippedCount > 0) {
        Alert.alert(
          '새로 가져온 거래 내역이 없어요',
          `이미 가져온 거래 ${skippedCount}건은 중복으로 건너뛰었어요.`,
        );
        return;
      }

      if (!hasSyncedTrades) {
        Alert.alert(
          '가져온 거래 내역이 없어요',
          '업비트에서 조회된 완료 거래가 없어요. API 키 계정, 주문조회 권한, 실제 체결 내역을 확인해주세요.',
        );
        return;
      }

      setSyncSuccessVisible(true);
    } catch (error) {
      Alert.alert(
        '거래 내역 가져오기 실패',
        getSyncErrorMessage(error),
      );
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <Tabs
        initialRouteName="index"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => (
          <CustomTabBar
            {...props}
            onFabPress={handleFabPress}
            isApiConnected={isApiConnected}
            isSyncing={isSyncing}
          />
        )}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="journal" />
        <Tabs.Screen name="input" />
        <Tabs.Screen name="principles" />
        <Tabs.Screen name="mypage" />
      </Tabs>

      <InputOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        bottomInset={insets.bottom}
      />

      <SyncSuccessModal
        visible={syncSuccessVisible}
        onClose={() => setSyncSuccessVisible(false)}
        bottomInset={insets.bottom}
      />
    </>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  groupPill: {
    flex: 1,
    height: 52,
    borderRadius: 32,
    padding: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(200, 200, 203, 0.55)',
  },
  groupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
    alignSelf: 'stretch',
  },
  glassSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
  groupItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemHighlight: {
    position: 'absolute',
    top: 1,
    left: 0,
    width: HIGHLIGHT_WIDTH,
    height: 42,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
  fabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 30,
    backgroundColor: COLORS_NEW.fab,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabDisabled: {
    opacity: 0.5,
  },
});
