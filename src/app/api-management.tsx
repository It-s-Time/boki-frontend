import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
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
import { COLORS, COLORS_NEW } from '@/shared/constants/colors';
import { useApiStore } from '@/store/apiStore';

const API_IP_ADDRESS = '13.124.152.202';

export default function ApiManagementScreen() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [focusedInput, setFocusedInput] = useState<'access' | 'secret' | null>(
    null,
  );
  const setApiConnected = useApiStore((s) => s.setApiConnected);

  const handleRegister = () => {
    setApiConnected(true);
    router.replace('/api-success');
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

          <Pressable style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerText}>API 키 등록하기</Text>
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
    lineHeight: 26,
    fontFamily: 'Pretendard-Regular',
  },
  ipLabel: {
    color: COLORS.textPrimary,
    fontSize: 22,
    lineHeight: 30,
    fontFamily: 'Pretendard-Regular',
    marginTop: 46,
    marginBottom: 10,
  },
  ipValue: {
    color: COLORS.textPrimary,
    fontSize: 25,
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
    marginBottom: 58,
  },
  registerText: {
    color: COLORS.box,
    fontSize: 24,
    lineHeight: 34,
    fontFamily: 'Pretendard-SemiBold',
  },
  guideSection: {
    gap: 22,
  },
  guideTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    lineHeight: 34,
    fontFamily: 'Pretendard-SemiBold',
  },
  guideText: {
    color: COLORS.textSecondary,
    fontSize: 17,
    lineHeight: 31,
    fontFamily: 'Pretendard-Regular',
  },
});
