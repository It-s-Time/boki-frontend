import { Tabs, usePathname } from 'expo-router';
import { Entypo, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { type ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/shared/constants/colors';

function TabIcon({
  focused,
  children,
}: {
  focused: boolean;
  children: ReactNode;
}) {
  return (
    <View style={[styles.iconBg, focused && styles.iconBgFocused]}>
      {children}
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isActiveTab = (name: string) => {
    if (name === 'index') {
      return pathname === '/' || pathname.endsWith('/index');
    }

    return pathname === `/${name}` || pathname.endsWith(`/${name}`);
  };

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.button,
          borderTopWidth: 0,
          height: 72 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarItemStyle: {
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          marginTop: 4,
          fontSize: 14,
          fontFamily: 'Pretendard-Medium',
        },
      }}
    >
        <Tabs.Screen
          name="index"
          options={{
            title: '홈',
            tabBarIcon: () => (
              <TabIcon focused={isActiveTab('index')}>
                <Entypo
                  name="calendar"
                  size={24}
                  color={
                    isActiveTab('index')
                      ? COLORS.textPrimary
                      : COLORS.textSecondary
                  }
                />
              </TabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="stats"
          options={{
            title: '통계',
            tabBarIcon: () => (
              <TabIcon focused={isActiveTab('stats')}>
                <MaterialCommunityIcons
                  name="google-analytics"
                  size={24}
                  color={
                    isActiveTab('stats')
                      ? COLORS.textPrimary
                      : COLORS.textSecondary
                  }
                />
              </TabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="input"
          options={{
            title: '입력',
            tabBarButton: ({ onPress }) => {
              const focused = isActiveTab('input');

              return (
                <Pressable style={styles.addButtonWrapper} onPress={onPress}>
                  <TabIcon focused={focused}>
                    <Entypo
                      name="plus"
                      size={24}
                      color={
                        focused ? COLORS.textPrimary : COLORS.textSecondary
                      }
                    />
                  </TabIcon>
                  <Text
                    style={[
                      styles.addLabel,
                      focused && styles.addLabelFocused,
                    ]}
                  >
                    입력
                  </Text>
                </Pressable>
              );
            },
          }}
        />

        <Tabs.Screen
          name="principles"
          options={{
            title: '원칙',
            tabBarIcon: () => (
              <TabIcon focused={isActiveTab('principles')}>
                <MaterialCommunityIcons
                  name="star-circle-outline"
                  size={28}
                  color={
                    isActiveTab('principles')
                      ? COLORS.textPrimary
                      : COLORS.textSecondary
                  }
                />
              </TabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="mypage"
          options={{
            title: '마이',
            tabBarIcon: () => (
              <TabIcon focused={isActiveTab('mypage')}>
                <AntDesign
                  name="setting"
                  size={24}
                  color={
                    isActiveTab('mypage')
                      ? COLORS.textPrimary
                      : COLORS.textSecondary
                  }
                />
              </TabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="home"
          options={{
            href: null,
          }}
        />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 3,
    gap: 2,
  },
  iconBg: {
    width: 56,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconBgFocused: {
    backgroundColor: COLORS.iconBox,
  },
  addLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Medium',
  },
  addLabelFocused: {
    color: COLORS.textPrimary,
  },
});
