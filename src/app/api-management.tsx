import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { getExchangeApiKeyStatus, saveExchangeApiKey } from '@/api/exchange';
import { COLORS, COLORS_NEW } from '@/shared/constants/colors';
import { useApiStore } from '@/store/apiStore';

const API_IP_ADDRESS = '13.124.152.202';

export default function ApiManagementScreen() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [focusedInput, setFocusedInput] = useState<'access' | 'secret' | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const setApiConnected = useApiStore((s) => s.setApiConnected);

  useEffect(() => {
    let isMounted = true;

    const loadApiKeyStatus = async () => {
      try {
        const data = await getExchangeApiKeyStatus();
        const connected = Boolean(data.isSuccess && data.result?.connected);

        if (isMounted) {
          setIsRegistered(connected);
          setApiConnected(connected);
        }
      } catch {
        if (isMounted) {
          setIsRegistered(false);
          setApiConnected(false);
        }
      }
    };

    void loadApiKeyStatus();

    return () => {
      isMounted = false;
    };
  }, [setApiConnected]);

  const getRegisterErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as
        | { message?: string; code?: string; error?: string }
        | undefined;

      const serverMessage = responseData?.message || responseData?.error;

      if (serverMessage) {
        return responseData.code
          ? `${serverMessage} (${responseData.code})`
          : serverMessage;
      }

      if (error.response?.status === 401) {
        return '로그인이 만료되었습니다. 다시 로그인한 뒤 등록해주세요.';
      }

      if (error.response?.status) {
        return `API 키 등록에 실패했습니다. (${error.response.status})`;
      }

      if (error.code === 'ECONNABORTED') {
        return '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
      }

      return `서버에 연결할 수 없습니다. (${error.message})`;
    }

    return error instanceof Error
      ? `API 키 등록에 실패했습니다. (${error.message})`
      : 'API 키 등록에 실패했습니다. 키 정보를 다시 확인해주세요.';
  };

  const handleRegister = async () => {
    const trimmedAccessKey = accessKey.trim();
    const trimmedSecretKey = secretKey.trim();

    if (!trimmedAccessKey || !trimmedSecretKey) {
      setErrorMessage('Access key와 Secret key를 모두 입력해주세요.');
      return;
    }

    if (isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const data = await saveExchangeApiKey({
        accessKey: trimmedAccessKey,
        secretKey: trimmedSecretKey,
      });

      if (!data.isSuccess || !data.result?.connected) {
        setErrorMessage(
          data.code
            ? `${data.message || 'API 키 등록에 실패했습니다.'} (${data.code})`
            : data.message || 'API 키 등록에 실패했습니다.',
        );
        return;
      }

      setApiConnected(true);
      setIsRegistered(true);
      router.replace('/api-success');
    } catch (error) {
      setErrorMessage(getRegisterErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={28} color={COLORS.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>업비트 API 관리</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.ipCard}>
            <Pressable style={styles.copyButton} onPress={() => {}}>
              <Text style={styles.copyText}>복사</Text>
            </Pressable>
            <Text style={styles.ipLabel}>사용 IP 주소</Text>
            <Text style={styles.ipValue}>{API_IP_ADDRESS}</Text>
          </View>

          <TextInput
            value={accessKey}
            onChangeText={setAccessKey}
            onFocus={() => setFocusedInput('access')}
            onBlur={() => setFocusedInput(null)}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={focusedInput === 'access' ? '' : 'Access key 입력'}
            placeholderTextColor={COLORS.textPrimary}
            style={styles.input}
            textAlign="center"
          />

          <TextInput
            value={secretKey}
            onChangeText={setSecretKey}
            onFocus={() => setFocusedInput('secret')}
            onBlur={() => setFocusedInput(null)}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            placeholder={focusedInput === 'secret' ? '' : 'Secret key 입력'}
            placeholderTextColor={COLORS.textPrimary}
            style={styles.input}
            textAlign="center"
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <Pressable
            style={[
              styles.registerButton,
              isSubmitting && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            <Text style={styles.registerText}>
              {isSubmitting ? '등록 중...' : 'API 키 등록하기'}
            </Text>
          </Pressable>

          {isRegistered ? <Text style={styles.statusText}>등록됨</Text> : null}

          <View style={styles.guideSection}>
            <Text style={styles.guideTitle}>업비트 API 연동 방법</Text>
            <Text style={styles.guideText}>
              1. 업비트 → 마이페이지 → Open API 관리 접속{'\n'}
              2. IP 주소 등록: {API_IP_ADDRESS} 입력{'\n'}
              3. API 키 발급 시 권한에서 자산조회 + 주문조회만 체크{'\n'}
              {'   '}⚠ 주문하기 / 입출금 권한은 체크 금지{'\n'}
              4. 발급된 Access Key, Secret Key를 BOKI 앱에 등록하기
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.box,
  },
  flex: {
    flex: 1,
  },
  header: {
    height: 112,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.box,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 23,
    letterSpacing: -0.92,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 34,
    paddingTop: 2,
    paddingBottom: 132,
  },
  ipCard: {
    height: 238,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  copyButton: {
    position: 'absolute',
    top: 34,
    minWidth: 84,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.box,
  },
  copyText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    letterSpacing: -0.72,
    lineHeight: 26,
    fontFamily: 'Pretendard-Regular',
  },
  ipLabel: {
    color: COLORS.textPrimary,
    fontSize: 22,
    letterSpacing: -0.88,
    lineHeight: 30,
    fontFamily: 'Pretendard-Regular',
    marginTop: 46,
    marginBottom: 10,
  },
  ipValue: {
    color: COLORS.textPrimary,
    fontSize: 25,
    letterSpacing: -1,
    lineHeight: 34,
    fontFamily: 'Pretendard-SemiBold',
  },
  input: {
    height: 70,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 28,
    backgroundColor: '#F4F3F8',
    color: COLORS.textPrimary,
    fontSize: 22,
    letterSpacing: -0.88,
    lineHeight: 30,
    fontFamily: 'Pretendard-SemiBold',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  registerButton: {
    height: 80,
    borderRadius: 28,
    backgroundColor: '#272727',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 16,
  },
  registerButtonDisabled: {
    opacity: 0.55,
  },
  registerText: {
    color: COLORS.box,
    fontSize: 24,
    letterSpacing: -0.96,
    lineHeight: 34,
    fontFamily: 'Pretendard-SemiBold',
  },
  errorText: {
    color: '#EE7A60',
    fontSize: 14,
    letterSpacing: -0.56,
    lineHeight: 20,
    fontFamily: 'Pretendard-Medium',
    textAlign: 'center',
    marginTop: -4,
    marginBottom: 12,
  },
  statusText: {
    color: '#2EAD5B',
    fontSize: 16,
    letterSpacing: -0.64,
    lineHeight: 24,
    fontFamily: 'Pretendard-SemiBold',
    textAlign: 'center',
    marginBottom: 34,
  },
  guideSection: {
    gap: 22,
  },
  guideTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    letterSpacing: -0.96,
    lineHeight: 34,
    fontFamily: 'Pretendard-SemiBold',
  },
  guideText: {
    color: COLORS.textSecondary,
    fontSize: 17,
    letterSpacing: -0.68,
    lineHeight: 31,
    fontFamily: 'Pretendard-Regular',
  },
});
