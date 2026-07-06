import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/shared/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { logoutApi } from '@/api/auth';

type ConfirmType = 'logout' | 'withdraw' | null;

const PROFILE_IMAGE = require('../../../design/j1y0on_Cute_3D_character_avatar_a_friendly_Asian_boy_wearing__6b66ae6e-f2fa-4be3-b4aa-272ee6565f3b_2 1.png');

export default function MyPageScreen() {
  const [confirmType, setConfirmType] = useState<ConfirmType>(null);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const closeModal = () => setConfirmType(null);
  const isWithdraw = confirmType === 'withdraw';

  const handleConfirm = async () => {
    if (confirmType === 'logout') {
      if (refreshToken) {
        await logoutApi(refreshToken).catch(() => {});
      }
      await clearAuth();
      router.replace('/(auth)/signup');
    } else {
      closeModal();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profile}>
          <View style={styles.avatarBox}>
            <Image source={PROFILE_IMAGE} style={styles.avatar} />
          </View>
          <Text style={styles.name}>김보키</Text>
          <Pressable style={styles.editButton} onPress={() => {}}>
            <Text style={styles.editText}>내 정보 수정</Text>
            <View style={styles.editArrowButton}>
              <Feather
                name="chevron-right"
                size={16}
                color={COLORS.textSecondary}
              />
            </View>
          </Pressable>
        </View>

        <SectionTitle title="거래 설정" />
        <MenuItem
          title="업비트 API 관리"
          onPress={() => router.push('/api-management')}
        />

        <SectionTitle title="약관 및 정책" />
        <MenuItem
          title="서비스 이용 약관"
          onPress={() => router.push('/terms')}
        />
        <MenuItem
          title="개인 정보 처리 방침"
          onPress={() => router.push('/privacy')}
        />

        <SectionTitle title="기타" />
        <MenuItem title="로그아웃" onPress={() => setConfirmType('logout')} />
        <MenuItem
          title="회원 탈퇴"
          onPress={() => setConfirmType('withdraw')}
        />
      </ScrollView>

      <Modal visible={confirmType !== null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {isWithdraw ? '정말 탈퇴하겠습니까?' : '정말 로그아웃 하겠습니까?'}
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={isWithdraw ? handleConfirm : closeModal}
              >
                <Text style={styles.cancelButtonText}>
                  {isWithdraw ? '떠날래요' : '취소'}
                </Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={isWithdraw ? closeModal : handleConfirm}
              >
                <Text style={styles.confirmButtonText}>
                  {isWithdraw ? '더 써볼래요' : '로그아웃'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function MenuItem({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuTitle}>{title}</Text>
      <View style={styles.arrowButton}>
        <Feather name="chevron-right" size={28} color={COLORS.textSecondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.box,
  },
  header: {
    height: 76,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.box,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 4,
    paddingHorizontal: 24,
    paddingBottom: 130,
  },
  profile: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 36,
  },
  avatarBox: {
    width: 136,
    height: 136,
    borderRadius: 8,
    backgroundColor: '#B7E8E3',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  avatar: {
    width: 136,
    height: 136,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
  },
  editButton: {
    marginTop: 14,
    minHeight: 38,
    paddingLeft: 18,
    paddingRight: 6,
    borderRadius: 19,
    backgroundColor: '#F4F3F8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editArrowButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.box,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: 14,
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: 'Pretendard-Medium',
  },
  menuItem: {
    height: 60,
    borderRadius: 16,
    backgroundColor: '#F4F3F8',
    paddingLeft: 20,
    paddingRight: 8,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.box,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.36)',
  },
  modalCard: {
    borderRadius: 28,
    backgroundColor: COLORS.box,
    paddingHorizontal: 20,
    paddingTop: 46,
    paddingBottom: 18,
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    lineHeight: 26,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
  },
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F4F3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  confirmButtonText: {
    color: COLORS.box,
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
});
