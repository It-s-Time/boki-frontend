import { router, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS_NEW } from '@/shared/constants/colors';
import BackHeader from '@/shared/components/BackHeader';
import ConfirmModal from '@/shared/components/ConfirmModal';
import { useAuthStore } from '@/store/authStore';
import { logoutApi } from '@/api/auth';
import { getMyProfile, type MemberProfile } from '@/api/member';

type ConfirmType = 'logout' | 'withdraw' | null;

const PROFILE_IMAGE = require('../../../assets/images/profile-avatar.png');

const getProfileImageUri = (profileImageUrl: string | null | undefined) => {
  if (!profileImageUrl) return null;
  if (/^https?:\/\//.test(profileImageUrl)) return profileImageUrl;

  const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  const path = profileImageUrl.startsWith('/')
    ? profileImageUrl
    : `/${profileImageUrl}`;

  return baseUrl ? `${baseUrl}${path}` : null;
};

export default function MyPageScreen() {
  const [confirmType, setConfirmType] = useState<ConfirmType>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const closeModal = () => setConfirmType(null);
  const isWithdraw = confirmType === 'withdraw';
  const nickname = profile?.nickname || '김보키';
  const profileImageUri = getProfileImageUri(profile?.profileImageUrl);
  const profileImageSource = profileImageUri
    ? { uri: profileImageUri }
    : PROFILE_IMAGE;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProfile = async () => {
        try {
          const data = await getMyProfile();

          if (isActive && data.isSuccess) {
            setProfile(data.result);
          }
        } catch {
          if (isActive) {
            setProfile(null);
          }
        }
      };

      void loadProfile();

      return () => {
        isActive = false;
      };
    }, []),
  );

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
        <BackHeader title="마이페이지" hideBackButton />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profile}>
          <View style={styles.avatarBox}>
            <Image source={profileImageSource} style={styles.avatar} />
          </View>
          <Text style={styles.name}>{nickname}</Text>
          <Pressable style={styles.editButton} onPress={() => {}}>
            <Text style={styles.editText}>내 정보 수정</Text>
            <View style={styles.editArrowButton}>
              <Feather
                name="chevron-right"
                size={16}
                color={COLORS_NEW.textSecondary}
              />
            </View>
          </Pressable>
        </View>

        <SectionTitle title="거래 설정" />
        <MenuItem
          title="업비트 API 관리"
          onPress={() => router.push('/(tabs)/api-management')}
        />

        <SectionTitle title="약관 및 정책" />
        <MenuItem
          title="서비스 이용 약관"
          onPress={() => router.push('/(tabs)/terms')}
        />
        <MenuItem
          title="개인 정보 처리 방침"
          onPress={() => router.push('/(tabs)/privacy')}
        />

        <SectionTitle title="기타" />
        <MenuItem title="로그아웃" onPress={() => setConfirmType('logout')} />
        <MenuItem
          title="회원 탈퇴"
          titleColor={COLORS_NEW.reviewed}
          onPress={() => setConfirmType('withdraw')}
        />
      </ScrollView>

      <ConfirmModal
        visible={confirmType !== null}
        title={isWithdraw ? '정말 탈퇴하겠습니까?' : '정말 로그아웃 하겠습니까?'}
        cancelLabel={isWithdraw ? '더 써볼래요' : '취소'}
        onCancel={closeModal}
        confirmLabel={isWithdraw ? '떠날래요' : '로그아웃'}
        onConfirm={handleConfirm}
      />
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function MenuItem({
  title,
  titleColor = COLORS_NEW.textPrimary,
  onPress,
}: {
  title: string;
  titleColor?: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Text style={[styles.menuTitle, { color: titleColor }]}>{title}</Text>
      <View style={styles.arrowButton}>
        <Feather name="chevron-right" size={28} color={COLORS_NEW.textSecondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_NEW.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
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
    borderRadius: 24,
    backgroundColor: COLORS_NEW.background,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 136,
    height: 136,
  },
  name: {
    color: COLORS_NEW.textPrimary,
    fontSize: 20,
    letterSpacing: -0.8,
    fontFamily: 'Pretendard-SemiBold',
  },
  editButton: {
    marginTop: 14,
    minHeight: 38,
    paddingLeft: 18,
    paddingRight: 6,
    borderRadius: 19,
    backgroundColor: COLORS_NEW.lightPurpleGray,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editArrowButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS_NEW.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    color: COLORS_NEW.textSecondary,
    fontSize: 14,
    letterSpacing: -0.56,
    fontFamily: 'Pretendard-Medium',
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: 14,
    color: COLORS_NEW.textPrimary,
    fontSize: 18,
    letterSpacing: -0.72,
    fontFamily: 'Pretendard-Medium',
  },
  menuItem: {
    height: 60,
    borderRadius: 16,
    backgroundColor: COLORS_NEW.lightPurpleGray,
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
    backgroundColor: COLORS_NEW.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    color: COLORS_NEW.textPrimary,
    fontSize: 18,
    letterSpacing: -0.72,
    fontFamily: 'Pretendard-SemiBold',
  },
});
