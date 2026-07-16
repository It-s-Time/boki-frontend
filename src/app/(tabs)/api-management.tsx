import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
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
import {
  deleteExchangeApiKey,
  getExchangeApiKeyStatus,
  saveExchangeApiKey,
} from '@/api/exchange';
import { COLORS, COLORS_NEW } from '@/shared/constants/colors';
import { useApiStore } from '@/store/apiStore';

const API_IP_ADDRESS = '13.124.152.202';
const DELETE_API_UNAVAILABLE_MESSAGE =
  'API 삭제 기능이 서버에 아직 연결되어 있지 않습니다. 백엔드에 DELETE /api/exchange/api-key API 추가가 필요합니다.';

export default function ApiManagementScreen() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [focusedInput, setFocusedInput] = useState<'access' | 'secret' | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [, setErrorMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setApiConnected = useApiStore((s) => s.setApiConnected);

  const goToMypage = useCallback(() => {
    router.replace('/(tabs)/mypage');
  }, []);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          goToMypage();
          return true;
        },
      );

      return () => subscription.remove();
    }, [goToMypage]),
  );

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

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
    };
  }, []);

  const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
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
        return `${fallbackMessage} (${error.response.status})`;
      }

      if (error.code === 'ECONNABORTED') {
        return '서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
      }

      return `서버에 연결할 수 없습니다. (${error.message})`;
    }

    return error instanceof Error
      ? `${fallbackMessage} (${error.message})`
      : fallbackMessage;
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
      setErrorMessage(
        getApiErrorMessage(
          error,
          'API 키 등록에 실패했습니다. 키 정보를 다시 확인해주세요.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const data = await deleteExchangeApiKey();

      if (!data.isSuccess) {
        const isServerDeleteError =
          data.code?.includes('500') || data.message?.includes('서버');

        if (isServerDeleteError) {
          setErrorMessage(DELETE_API_UNAVAILABLE_MESSAGE);
          return;
        }

        setErrorMessage(
          data.code
            ? `${data.message || 'API 삭제에 실패했습니다.'} (${data.code})`
            : data.message || 'API 삭제에 실패했습니다.',
        );
        return;
      }

      setAccessKey('');
      setSecretKey('');
      setIsRegistered(false);
      setApiConnected(false);
      router.replace('/(tabs)/api-deleted');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 404 || status === 405 || status === 500) {
          setErrorMessage(DELETE_API_UNAVAILABLE_MESSAGE);
          return;
        }
      }

      setErrorMessage(
        getApiErrorMessage(
          error,
          'API 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyIpAddress = async () => {
    try {
      const Clipboard = await import('expo-clipboard');
      await Clipboard.setStringAsync(API_IP_ADDRESS);
      setIsCopied(true);

      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }

      copyResetTimerRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 1200);
    } catch {
      setErrorMessage(
        '복사 기능을 사용하려면 앱을 다시 빌드해주세요. IP 주소를 직접 복사해주세요.',
      );
    }
  };

  const buttonLabel = isRegistered
    ? isSubmitting
      ? '삭제 중...'
      : '등록한 API 삭제하기'
    : isSubmitting
      ? '등록 중...'
      : 'API 키 등록하기';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={goToMypage}>
            <Feather name="chevron-left" size={32} color={COLORS.textPrimary} />
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
            <Pressable style={styles.copyButton} onPress={handleCopyIpAddress}>
              <Text style={styles.copyText}>{isCopied ? '복사됨' : '복사'}</Text>
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
            editable={!isRegistered && !isSubmitting}
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
            editable={!isRegistered && !isSubmitting}
          />

          <Pressable
            style={[
              styles.registerButton,
              isSubmitting && styles.registerButtonDisabled,
            ]}
            onPress={isRegistered ? handleDelete : handleRegister}
            disabled={isSubmitting}
          >
            <Text style={styles.registerText}>{buttonLabel}</Text>
          </Pressable>

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
    height: 94,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
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
    fontSize: 22,
    letterSpacing: -0.88,
    fontFamily: 'Pretendard-Regular',
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 34,
    paddingTop: 0,
    paddingBottom: 124,
  },
  ipCard: {
    height: 210,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  copyButton: {
    position: 'absolute',
    top: 19,
    minWidth: 72,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.box,
  },
  copyText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    letterSpacing: -0.6,
    lineHeight: 20,
    fontFamily: 'Pretendard-Regular',
  },
  ipLabel: {
    color: COLORS.textPrimary,
    fontSize: 20,
    letterSpacing: -0.8,
    lineHeight: 28,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 34,
    marginBottom: 6,
  },
  ipValue: {
    color: COLORS.textPrimary,
    fontSize: 28,
    letterSpacing: -1.12,
    lineHeight: 36,
    fontFamily: 'Pretendard-SemiBold',
  },
  input: {
    height: 66,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    backgroundColor: '#F4F3F8',
    color: COLORS.textPrimary,
    fontSize: 22,
    letterSpacing: -0.88,
    lineHeight: 30,
    fontFamily: 'Pretendard-SemiBold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  registerButton: {
    height: 72,
    borderRadius: 30,
    backgroundColor: '#272727',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 28,
  },
  registerButtonDisabled: {
    opacity: 0.55,
  },
  registerText: {
    color: COLORS.box,
    fontSize: 23,
    letterSpacing: -0.92,
    lineHeight: 32,
    fontFamily: 'Pretendard-SemiBold',
  },
  guideSection: {
    gap: 12,
    marginTop: 16,
  },
  guideTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    letterSpacing: -0.96,
    lineHeight: 32,
    fontFamily: 'Pretendard-SemiBold',
  },
  guideText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    letterSpacing: -0.64,
    lineHeight: 32,
    fontFamily: 'Pretendard-Regular',
  },
});
