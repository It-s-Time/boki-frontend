import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/shared/constants/colors';
import ScreenHeader from '@/shared/components/ScreenHeader';
import Button from '@/shared/components/Button';
import LoadingScreen from '@/shared/components/LoadingScreen';

export default function ApiKeyScreen() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(false);
    }, []),
  );

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/api-success');
    }, 2000);
  };

  if (isLoading) return <LoadingScreen message="API가 연동되고 있어요" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 스크롤 영역: 헤더 + 가이드 카드 + IP */}
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader
            title="업비트 API 키 등록하기"
            onBack={() => router.back()}
          />
          <Text style={styles.subtitle}>
            원활한 매매일지 기록을 위해 등록해주세요
          </Text>

          {/* Q1 가이드 카드 */}
          <View style={styles.guideCard}>
            <View style={styles.guideHeader}>
              <Text style={styles.questionLabel}>Q1.</Text>
              <Text style={styles.questionText}>
                업비트 API 키 어떻게 발급받나요?
              </Text>
            </View>
            <View style={styles.guideBody}>
              <View style={styles.guideContent}>
                <Text style={styles.guideContentPlaceholder}>
                  설명하는 페이지
                </Text>
              </View>
              <Text style={styles.guideNote}>
                API 키는 서버 내부에 철저한 암호화를 통해 저장됩니다.
              </Text>
            </View>
          </View>

          {/* IP 주소 */}
          <View style={styles.ipRow}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Text style={styles.ipText}>사용 IP 주소:</Text>
              <Text style={styles.ipValue}>1123.123.3123.13</Text>
            </View>
            <Pressable style={styles.copyButton}>
              <Text style={styles.copyText}>복사</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* 하단 고정: 입력 폼 + 등록하기 버튼 */}
        <View style={styles.bottom}>
          <View style={styles.form}>
            <View style={styles.field}>
              <View style={styles.labelBox}>
                <Text style={styles.labelText}>Access key</Text>
              </View>
              <TextInput
                value={accessKey}
                onChangeText={setAccessKey}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Access key를 입력해주세요."
                placeholderTextColor={COLORS.border}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <View style={styles.labelBox}>
                <Text style={styles.labelText}>Secret key</Text>
              </View>
              <TextInput
                value={secretKey}
                onChangeText={setSecretKey}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                placeholder="Secret key를 입력해주세요."
                placeholderTextColor={COLORS.border}
                style={styles.input}
              />
            </View>
          </View>

          <Button label="등록하기" onPress={handleSubmit} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 8,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    letterSpacing: -0.64,
    marginLeft: 44,
    marginBottom: 16,
  },
  guideCard: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  guideHeader: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 4,
  },
  questionLabel: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    letterSpacing: -0.56,
  },
  questionText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    letterSpacing: -0.72,
  },
  guideBody: {
    backgroundColor: COLORS.box,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  guideContent: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideContentPlaceholder: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    letterSpacing: -0.64,
  },
  guideNote: {
    color: COLORS.textSecondary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    letterSpacing: -0.48,
    textAlign: 'center',
  },
  ipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.box,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  ipText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    letterSpacing: -0.64,
  },
  ipValue: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    letterSpacing: -0.64,
  },
  copyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.iconBox,
  },
  copyText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    letterSpacing: -0.48,
  },
  bottom: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    gap: 12,
  },
  form: {
    gap: 12,
    marginBottom: 40,
  },
  field: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    height: 50,
  },
  labelBox: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  labelText: {
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    letterSpacing: -0.64,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.box,
    color: COLORS.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    letterSpacing: -0.64,
  },
});
