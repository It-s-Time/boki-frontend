import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/shared/constants/colors';

type ConfirmType = 'logout' | 'withdraw' | null;

export default function MyPageScreen() {
  const [confirmType, setConfirmType] = useState<ConfirmType>(null);

  const closeModal = () => setConfirmType(null);
  const isWithdraw = confirmType === 'withdraw';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>마이페이지</Text>

        <View style={styles.profile}>
          <View style={styles.avatar} />
          <Text style={styles.name}>김보키</Text>
          <Text style={styles.email}>bokikim@email.com</Text>
          <Pressable style={styles.editButton}>
            <Text style={styles.editText}>내 정보 수정</Text>
          </Pressable>
        </View>

        <SectionTitle title="거래 설정" />
        <MenuItem
          title="업비트 API 관리"
          description="API 키 연동 및 설정"
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
          title="회원탈퇴"
          description="계정 및 데이터 삭제"
          danger
          onPress={() => setConfirmType('withdraw')}
        />
      </ScrollView>

      <Modal visible={confirmType !== null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, isWithdraw && styles.withdrawCard]}>
            <Text style={[styles.modalTitle, isWithdraw && styles.darkText]}>
              {isWithdraw ? '회원 탈퇴' : '로그아웃'}
            </Text>
            <Text
              style={[styles.modalMessage, isWithdraw && styles.darkMessage]}
            >
              {isWithdraw
                ? '모든 데이터가 영구 삭제되며 복구할 수 없습니다.'
                : '정말 로그아웃 하시겠습니까?'}
            </Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>취소</Text>
              </Pressable>
              <Pressable style={styles.confirmButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>
                  {isWithdraw ? '탈퇴하기' : '로그아웃'}
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
  description,
  danger = false,
  onPress,
}: {
  title: string;
  description?: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.menuItem, danger && styles.dangerMenu]}
      onPress={onPress}
    >
      <View style={styles.menuIcon} />
      <View style={styles.menuTextBox}>
        <Text style={[styles.menuTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        {description ? (
          <Text style={styles.menuDescription}>{description}</Text>
        ) : null}
      </View>
      <Feather name="chevron-right" size={24} color={COLORS.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 44,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  title: {
    marginBottom: 26,
    color: COLORS.textPrimary,
    fontSize: 26,
    fontFamily: 'Pretendard-Bold',
  },
  profile: {
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginHorizontal: -24,
    marginBottom: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#B5BBC8',
    marginBottom: 14,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontFamily: 'Pretendard-SemiBold',
  },
  email: {
    marginTop: 6,
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
  },
  editButton: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.box,
  },
  editText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: 'Pretendard-Regular',
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 18,
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  menuItem: {
    minHeight: 68,
    borderRadius: 8,
    backgroundColor: COLORS.box,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerMenu: {
    borderWidth: 1,
    borderColor: COLORS.buyText,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#D2D2D2',
    marginRight: 14,
  },
  menuTextBox: {
    flex: 1,
    gap: 6,
  },
  menuTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  dangerText: {
    color: COLORS.buyText,
  },
  menuDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.36)',
  },
  modalCard: {
    borderRadius: 8,
    backgroundColor: COLORS.box,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  withdrawCard: {
    backgroundColor: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.buyText,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
  },
  darkText: {
    color: COLORS.box,
  },
  modalMessage: {
    marginTop: 14,
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
  },
  darkMessage: {
    color: COLORS.textSecondary,
  },
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 16,
    marginTop: 48,
  },
  cancelButton: {
    flex: 1,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.iconBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
  },
});
