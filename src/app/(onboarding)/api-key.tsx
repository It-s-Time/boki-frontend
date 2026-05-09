import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ApiKeyScreen() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <Text style={styles.title}>
              원활한 매매일지 기록을 위해{'\n'}
              <Text style={styles.titleMuted}>업비트 API 키</Text>를
              등록해주세요!
            </Text>
            <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={10}>
              <Text style={styles.skipText}>나중에하기</Text>
            </Pressable>
          </View>

          <Text style={styles.question}>
            Q. 업비트 API 키 어떻게 발급받나요?
          </Text>

          <View style={styles.guideBox}>
            <Text style={styles.guideArrow}>{'>'}</Text>
            <View style={styles.guideCaption}>
              <Text style={styles.guideCaptionText}>설명</Text>
            </View>
          </View>

          <View style={styles.ipRow}>
            <Text style={styles.ipText}>사용 IP주소: 1123.123.3123.13</Text>
            <Pressable style={styles.copyButton}>
              <Text style={styles.copyText}>복사</Text>
            </Pressable>
          </View>

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
                placeholderTextColor="#B3B3B3"
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
                placeholderTextColor="#B3B3B3"
                style={styles.input}
              />
            </View>
          </View>

          <Pressable
            style={styles.submitButton}
            onPress={() => router.replace('/design-preview')}
          >
            <Text style={styles.submitText}>등록하기</Text>
          </Pressable>

          <View style={styles.note}>
            <Text style={styles.noteTitle}>{'<참고>'}</Text>
            <Text style={styles.noteText}>
              API 키는 서버 내부에{'\n'}철저한 암호화를 통해 저장됩니다.
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
    backgroundColor: '#FFFFFF',
  },
  keyboardArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 27,
    paddingTop: 102,
    paddingBottom: 48,
    backgroundColor: '#FFFFFF',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    color: '#000000',
    fontFamily: 'Pretendard-Light',
    fontSize: 19,
    fontWeight: '400',
    lineHeight: 27,
  },
  titleMuted: {
    color: '#8A8A8A',
  },
  skipText: {
    marginTop: 30,
    transform: [{ translateX: -5 }],
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 19,
    fontWeight: '400',
  },
  question: {
    marginTop: 40,
    alignSelf: 'center',
    color: '#8A8A8A',
    fontFamily: 'Pretendard-Regular',
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 30,
  },
  guideBox: {
    height: 288,
    marginTop: 15,
    backgroundColor: '#D9D9D9',
  },
  guideArrow: {
    position: 'absolute',
    right: 20,
    top: 132,
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 42,
    fontWeight: '200',
    lineHeight: 42,
  },
  guideCaption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#AEACAC',
  },
  guideCaptionText: {
    color: '#000000',
    fontFamily: 'Pretendard-Light',
    fontSize: 32,
    fontWeight: '300',
  },
  ipRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  ipText: {
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 17,
    fontWeight: '400',
  },
  copyButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#E2E2E2',
  },
  copyText: {
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 11,
    fontWeight: '400',
  },
  form: {
    width: 346,
    maxWidth: '100%',
    marginTop: 16,
    alignSelf: 'center',
    gap: 24,
  },
  field: {
    position: 'relative',
    paddingTop: 31,
    alignItems: 'flex-start',
    transform: [{ translateX: 40 }],
  },
  labelBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    minWidth: 119,
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8F8F8F',
    elevation: 1,
  },
  labelText: {
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 18,
    fontWeight: '400',
  },
  input: {
    width: 276,
    maxWidth: '100%',
    alignSelf: 'flex-start',
    height: 42,
    paddingHorizontal: 31,
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 18,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
    letterSpacing: 0.2,
    backgroundColor: '#E9E9E9',
  },
  submitButton: {
    width: 145,
    height: 36,
    marginTop: 15,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C7C7C7',
  },
  submitText: {
    color: '#000000',
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    fontWeight: '400',
  },
  note: {
    marginTop: 40,
    alignItems: 'center',
  },
  noteTitle: {
    color: '#8A8A8A',
    fontFamily: 'Pretendard-Regular',
    fontSize: 20,
    fontWeight: '400',
    opacity: 0.8,
  },
  noteText: {
    marginTop: 2,
    color: '#A7A7A7',
    fontFamily: 'Pretendard-Regular',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'center',
    opacity: 0.8,
  },
});
