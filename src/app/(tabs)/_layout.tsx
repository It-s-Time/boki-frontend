import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, View, StyleSheet } from 'react-native';
import { type ComponentType, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS_NEW } from '@/shared/constants/colors';
import InputOptionsModal from '@/features/input/components/InputOptionsModal';
import HomeIcon from '../../../assets/icons/home.svg';
import LogIcon from '../../../assets/icons/log2.svg';
import PrincipleIcon from '../../../assets/icons/principle.svg';
import MyIcon from '../../../assets/icons/my.svg';
import AddIcon from '../../../assets/icons/add.svg';

const TAB_BAR_HEIGHT = 52;
const ICON_SIZE = 16;

interface TabIconConfig {
  name: string;
  Icon: ComponentType<{ width?: number; height?: number; color?: string }>;
  width: number;
  height: number;
}

const LEFT_TABS: TabIconConfig[] = [
  { name: 'index', Icon: HomeIcon, width: ICON_SIZE, height: ICON_SIZE },
  { name: 'stats', Icon: LogIcon, width: ICON_SIZE * 0.75, height: ICON_SIZE },
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

function CustomTabBar({
  state,
  navigation,
  onAddPress,
}: BottomTabBarProps & { onAddPress: () => void }) {
  const insets = useSafeAreaInsets();

  const renderGroupItem = ({ name, Icon, width, height }: TabIconConfig) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return null;
    const isFocused = state.index === state.routes.indexOf(route);

    return (
      <Pressable
        key={route.key}
        style={styles.groupItem}
        onPress={() => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }}
      >
        <View
          style={[
            styles.itemHighlight,
            isFocused && styles.itemHighlightFocused,
          ]}
        >
          <Icon width={width} height={height} />
        </View>
      </Pressable>
    );
  };

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
        <View style={styles.groupPill}>
          {LEFT_TABS.map((tab) => renderGroupItem(tab))}
        </View>

        <Pressable style={styles.fabWrapper} onPress={onAddPress}>
          <View style={styles.fab}>
            <AddIcon width={18} height={18} color="#FFFFFF" />
          </View>
        </Pressable>

        <View style={styles.groupPill}>
          {RIGHT_TABS.map((tab) => renderGroupItem(tab))}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <Tabs
        initialRouteName="index"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => (
          <CustomTabBar {...props} onAddPress={() => setModalVisible(true)} />
        )}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="stats" />
        <Tabs.Screen name="input" />
        <Tabs.Screen name="principles" />
        <Tabs.Screen name="mypage" />
      </Tabs>

      <InputOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: COLORS_NEW.lightGray,
    flex: 1,
    height: 52,
    borderRadius: 32,
    padding: 2,
  },
  groupItem: {
    width: 56,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemHighlight: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemHighlightFocused: {
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
});
