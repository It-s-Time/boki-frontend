import { router } from 'expo-router';
import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/shared/components/ScreenHeader';
import { COLORS } from '@/shared/constants/colors';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="서비스 이용약관"
        onBack={() => router.back()}
        style={styles.header}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Article title="제 1조 (목적)">
            본 약관은 잇심동체(이하 "서비스")의 이용과 관련하여 회사와 회원
            간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로
            합니다.
          </Article>
          <Article title="제 2조 (정의)">
            본 약관에서 사용하는 용어의 정의는 다음과 같습니다. "서비스"란 구현
            가능한 모든 단말기(PC, TV, 휴대형단말기 등)를 통해 회원이 이용할 수
            있는 잇심동체 관련 제반 서비스를 의미합니다.
          </Article>
          <Paragraph>
            "회원"이란 회사의 서비스에 접속하여 본 약관에 따라 회사와 이용계약을
            체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.
          </Paragraph>
          <Paragraph>
            "매매원칙"이란 회원이 설정한 암호화폐 거래 시 준수해야 할 규칙과
            전략을 의미합니다.
          </Paragraph>
          <Paragraph>
            "매매일지"란 회원의 암호화폐 거래 내역과 복기 내용을 기록한 문서를
            의미합니다.
          </Paragraph>
          <Article title="제 3조 (서비스의 제공 및 변경)">
            회사는 다음과 같은 서비스를 제공합니다.
          </Article>
          <Paragraph>
            {'  '}• 매매일지 작성 및 관리 서비스{'\n'}
            {'  '}• 매매원칙 설정 및 복기 서비스{'\n'}
            {'  '}• AI 기반 거래 분석 및 팩트체크 서비스{'\n'}
            {'  '}• 업비트 API 연동을 통한 자동 거래 동기화{'\n'}
            {'  '}• 거래 통계 및 리포트 제공
          </Paragraph>
          <Paragraph>
            기타 회사가 추가 개발하거나 다른 회사와의 제휴 계약 등을 통해
            회원에게 제공하는 일체의 서비스
          </Paragraph>
          <Article title="제 4조 (서비스의 중단)">
            회사는 설비 점검, 교체, 고장, 통신 두절 또는 운영상 상당한 이유가
            있는 경우 서비스 제공을 일시적으로 중단할 수 있습니다.
          </Article>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Article({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.article}>
      <Text style={styles.articleTitle}>{title}</Text>
      <Text style={styles.paragraph}>{children}</Text>
    </View>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 40,
    paddingTop: 48,
    paddingBottom: 26,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 64,
  },
  card: {
    borderRadius: 8,
    backgroundColor: COLORS.box,
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  article: {
    marginBottom: 22,
  },
  articleTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontFamily: 'Pretendard-Bold',
    marginBottom: 14,
  },
  paragraph: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 28,
    fontFamily: 'Pretendard-Regular',
    marginBottom: 18,
  },
});
