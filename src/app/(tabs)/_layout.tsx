import { Tabs, router, usePathname } from 'expo-router';
import { Entypo, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, View, Text, StyleSheet, Modal } from 'react-native';
import { type ReactNode } from 'react';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/shared/constants/colors';
import Button from '@/shared/components/Button';

const IS_API_CONNECTED = false;

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
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const close = () => setModalVisible(false);
  const pathname = usePathname();

  const isActiveTab = (name: string) => {
    if (name === 'index') {
      return pathname === '/' || pathname.endsWith('/index');
    }

    return pathname === `/${name}` || pathname.endsWith(`/${name}`);
  };

  return (
    <>
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
            tabBarButton: () => {
              const focused = isActiveTab('input');

              return (
                <Pressable style={styles.addButtonWrapper} onPress={() => setModalVisible(true)}>
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
                    style={[styles.addLabel, focused && styles.addLabelFocused]}
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
  addLabelFocused: {
    color: COLORS.textPrimary,
  },
});
