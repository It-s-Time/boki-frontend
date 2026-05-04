import { Tabs } from 'expo-router';
import { Entypo, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, View, Text, Modal, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/shared/constants/colors';

export default function TabLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.button,
            borderTopWidth: 0,
            height: 72 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarActiveTintColor: COLORS.textSecondary,
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
            tabBarIcon: ({ color }) => (
              <Entypo name="calendar" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="stats"
          options={{
            title: '통계',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="google-analytics"
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="input"
          options={{
            title: '입력',
            tabBarButton: () => (
              <Pressable
                style={styles.addButtonWrapper}
                onPress={() => setModalVisible(true)}
              >
                <View style={styles.addIconBg}>
                  <Entypo name="plus" size={24} color="#636366" />
                </View>
                <Text style={styles.addLabel}>입력</Text>
              </Pressable>
            ),
          }}
        />

        <Tabs.Screen
          name="principles"
          options={{
            title: '원칙',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="star-circle-outline"
                size={28}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="mypage"
          options={{
            title: '마이',
            tabBarIcon: ({ color }) => (
              <AntDesign name="setting" size={24} color={color} />
            ),
          }}
        />
      </Tabs>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.title}>거래 내역 입력</Text>

            {/* 입력 폼 */}

            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>닫기</Text>
            </Pressable>
          </View>
        </View>
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
  addIconBg: {
    backgroundColor: COLORS.iconBox,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  addLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 360,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
