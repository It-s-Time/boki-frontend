import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, View, StyleSheet } from 'react-native';
import { type ComponentType, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS_NEW } from '@/shared/constants/colors';
import InputOptionsModal from '@/features/input/components/InputOptionsModal';
import SyncSuccessModal from '@/features/input/components/SyncSuccessModal';
import { useApiStore } from '@/store/apiStore';
import HomeIcon from '../../../assets/icons/home.svg';
import LogIcon from '../../../assets/icons/log2.svg';
import PrincipleIcon from '../../../assets/icons/principle.svg';
import MyIcon from '../../../assets/icons/my.svg';
import AddIcon from '../../../assets/icons/add.svg';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const SYNC_DURATION_MS = 1200;

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
  onFabPress,
  isApiConnected,
  isSyncing,
}: BottomTabBarProps & {
  onFabPress: () => void;
  isApiConnected: boolean;
  isSyncing: boolean;
}) {
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
          <BlurView
            intensity={35}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
            locations={[0, 0.6]}
            style={styles.glassSheen}
          />
          <View style={styles.groupContent}>
            {LEFT_TABS.map((tab) => renderGroupItem(tab))}
          </View>
        </View>

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

        <View style={styles.groupPill}>
          <BlurView
            intensity={35}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
            locations={[0, 0.6]}
            style={styles.glassSheen}
          />
          <View style={styles.groupContent}>
            {RIGHT_TABS.map((tab) => renderGroupItem(tab))}
          </View>
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessVisible, setSyncSuccessVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const isApiConnected = useApiStore((s) => s.isApiConnected);

  const handleFabPress = () => {
    if (!isApiConnected) {
      setModalVisible(true);
      return;
    }
    if (isSyncing) return;

    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccessVisible(true);
    }, SYNC_DURATION_MS);
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
    width: 70,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemHighlightFocused: {
    backgroundColor: '#FFF',
    borderRadius: 32,
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
