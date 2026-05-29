import { router } from 'expo-router';
import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '@/shared/components/ScreenHeader';
import { COLORS } from '@/shared/constants/colors';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="개인정보처리방침"
        onBack={() => router.back()}
        style={styles.header}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.paragraph}>
            잇심동체(이하 "회사")는 정보주체의 자유와 권리 보호를 위해
            개인정보 보호법 및 관계 법령이 정한 바를 준수하며, 적법하게
            개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 개인정보 보호법
            제30조에 따라 정보주체에게 개인정보 처리에 관한 절차 및 기준을
            안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기
            위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </Text>

          <Article title="1. 개인정보의 수집 및 이용 목적">
            회사는 다음의 목적을 위하여 개인정보를 처리합니다.
          </Article>
          <Paragraph>
            {'  '}• 회원 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른
            본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종
            고지·통지
          </Paragraph>
          <Paragraph>
            {'  '}• 서비스 제공: 매매일지 작성 및 관리, 매매원칙 설정 및 복기,
            AI 기반 거래 분석, 업비트 API 연동을 통한 거래 내역 자동 동기화
          </Paragraph>
          <Paragraph>
            {'  '}• 서비스 개선: 신규 서비스 개발 및 맞춤 서비스 제공, 통계학적
            특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인
          </Paragraph>
          <Paragraph>
            {'  '}• 마케팅 및 광고: 이벤트 및 광고성 정보 제공, 참여기회 제공
          </Paragraph>

          <Article title="2. 수집하는 개인정보 항목">
            가. 회원가입 시
          </Article>
          <Paragraph>
            {'  '}• 필수항목: 이름, 이메일 주소, 소셜 로그인 정보 (Google/Kakao
            ID){'\n'}
            {'  '}• 선택항목: 프로필 사진
          </Paragraph>
          <Paragraph>
            나. 서비스 이용 시{'\n'}
            {'  '}• 선택항목: 업비트 API 키 (Access Key, Secret Key){'\n'}
            {'  '}• 자동수집항목: 서비스 이용 기록, 접속 로그, IP 주소, 쿠키
          </Paragraph>
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
    marginTop: 16,
    marginBottom: 8,
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
