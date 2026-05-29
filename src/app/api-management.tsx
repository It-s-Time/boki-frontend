import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
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
import Button from '@/shared/components/Button';
import ScreenHeader from '@/shared/components/ScreenHeader';

export default function ApiManagementScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showAccessKey, setShowAccessKey] = useState(true);
  const [showSecretKey, setShowSecretKey] = useState(true);

  const handleConnect = () => {
    setIsConnected(true);
    setAccessKey(accessKey || 'Ab3dEfGhIjKlMn0pQrStUvWxYz12345');
    setSecretKey(secretKey || 'XyZ9876543210WvUtSrQpOnMlKjIhGfEd');
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenHeader
          title="업비트 API 관리"
          onBack={() => router.back()}
          style={styles.header}
        />

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {isConnected ? (
            <View style={styles.successCard}>
              <View style={styles.smallIcon} />
              <View style={styles.flex}>
                <Text style={styles.successTitle}>연동 완료</Text>
                <Text style={styles.description}>
                  업비트 API가 성공적으로 연동되었습니다.
                </Text>
              </View>
            </View>
          ) : null}

          <View style={styles.infoCard}>
            <View style={styles.infoIcon} />
            <View style={styles.flex}>
              <Text style={styles.infoTitle}>API 연동 안내</Text>
              <Text style={styles.infoText}>
                업비트 API 키를 연동하면 거래 내역을 자동으로 불러올 수
                있습니다. 키는 안전하게 암호화되어 저장됩니다.
              </Text>
            </View>
          </View>

          <ApiField
            label="Secret Key"
            value={accessKey}
            onChangeText={setAccessKey}
            placeholder="API 키를 입력하세요."
            secureTextEntry={isConnected && !showAccessKey}
            showToggle={isConnected}
            onToggle={() => setShowAccessKey((value) => !value)}
          />
          <ApiField
            label="Access Key"
            value={secretKey}
            onChangeText={setSecretKey}
            placeholder="Secret 키를 입력하세요."
            secureTextEntry={isConnected && !showSecretKey}
            showToggle={isConnected}
            onToggle={() => setShowSecretKey((value) => !value)}
          />

          <Text style={styles.sectionTitle}>API 키 발급 방법</Text>
          <View style={styles.guideBox}>
            {[
              '업비트 웹사이트 로그인',
              '마이페이지 -> Open API 관리 메뉴 선택',
              'API 키 발급 버튼 클릭',
              '필요한 권한 선택 (조회 권한 필수)',
              '발급된 키를 복사하여 입력',
            ].map((item) => (
              <Text key={item} style={styles.guideText}>
                {item}
              </Text>
            ))}
          </View>

          {isConnected ? (
            <Pressable
              style={styles.unlinkButton}
              onPress={() => setIsConnected(false)}
            >
              <Text style={styles.unlinkText}>연동 해제</Text>
            </Pressable>
          ) : null}

          <View style={styles.submitBox}>
            <Button label="연동하기" onPress={handleConnect} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ApiField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  showToggle,
  onToggle,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry: boolean;
  showToggle: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={secureTextEntry}
          style={styles.input}
        />
        {showToggle ? (
          <Pressable onPress={onToggle} hitSlop={8}>
            <Feather name="eye" size={20} color={COLORS.textSecondary} />
          </Pressable>
        ) : null}
      </View>
    </View>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 28,
  },
  successCard: {
    minHeight: 68,
    borderRadius: 8,
    backgroundColor: COLORS.box,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  smallIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#D2D2D2',
  },
  successTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 6,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontFamily: 'Pretendard-Regular',
  },
  infoCard: {
    borderRadius: 8,
    backgroundColor: COLORS.primaryLight,
    padding: 10,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 42,
  },
  infoIcon: {
    width: 76,
    height: 76,
    borderRadius: 8,
    backgroundColor: '#D2D2D2',
  },
  infoTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 8,
    marginBottom: 8,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'Pretendard-Regular',
  },
  field: {
    marginBottom: 22,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 18,
  },
  inputBox: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.box,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    fontFamily: 'Pretendard-Regular',
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 2,
    marginBottom: 20,
  },
  guideBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 18,
  },
  guideText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 28,
    fontFamily: 'Pretendard-Regular',
  },
  unlinkButton: {
    height: 68,
    borderRadius: 8,
    backgroundColor: COLORS.buy,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 68,
  },
  unlinkText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  submitBox: {
    marginTop: 48,
  },
});
