import { Tabs, router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, View, Text, StyleSheet, Modal } from 'react-native';
import { type ComponentType, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, COLORS_NEW } from '@/shared/constants/colors';
import Button from '@/shared/components/Button';
import HomeIcon from '../../../assets/icons/home.svg';
import LogIcon from '../../../assets/icons/log2.svg';
import PrincipleIcon from '../../../assets/icons/principle.svg';
import MyIcon from '../../../assets/icons/my.svg';
import AddIcon from '../../../assets/icons/add.svg';

const IS_API_CONNECTED = false;
const TAB_BAR_HEIGHT = 52;
const ICON_SIZE = 18;

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
            <AddIcon width={22} height={22} color="#FFFFFF" />
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
  const close = () => setModalVisible(false);

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

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom }]}>
            <Text style={styles.title}>거래 내역 입력</Text>

            <View style={styles.optionGroup}>
              {/* 수동 입력 */}
              <Pressable
                style={styles.option}
                onPress={() => {
                  close();
                  router.push('/input/manual');
                }}
              >
                <Text style={styles.optionTitle}>수동 입력</Text>
                <Text style={styles.optionDesc}>
                  거래 내역을 직접 입력합니다
                </Text>
              </Pressable>

              {/* API 연동 */}
              <Pressable
                style={[
                  styles.option,
                  IS_API_CONNECTED && styles.optionDisabled,
                ]}
                disabled={IS_API_CONNECTED}
                onPress={() => {
                  close();
                  router.push('/api-key');
                }}
              >
                <Text style={[styles.optionTitle]}>
                  {IS_API_CONNECTED
                    ? '업비트 API가 이미 연동되어 있습니다.'
                    : 'API 연동'}
                </Text>
                <Text style={styles.optionDesc}>
                  {IS_API_CONNECTED
                    ? '거래 내역을 자동으로 불러옵니다.'
                    : '업비트 API로 자동 동기합니다.'}
                </Text>
              </Pressable>
            </View>
            <Button label="취소" onPress={close} variant="secondary" />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
    height: 60,
    borderRadius: 999,
    paddingHorizontal: 8,
  },
  groupItem: {
    width: 56,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemHighlight: {
    width: 48,
    height: 40,
    borderRadius: 999,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS_NEW.fab,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: COLORS.box,
    padding: 24,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    gap: 20,
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 22,
  },
  optionGroup: {
    overflow: 'hidden',
    gap: 12,
  },
  option: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    gap: 4,
  },
  optionDisabled: {
    backgroundColor: COLORS.selectedBox,
  },
  optionTitle: {
    color: '#000000',
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
  },
  optionDesc: {
    color: '#6A7282',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
  },
});
