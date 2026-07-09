import { useRouter, useLocalSearchParams } from 'expo-router';
import ReportDetail from '@/features/review/components/ReportDetail';

export default function AiReportScreen() {
  const router = useRouter();
  // tradeId isn't used yet; it'll drive the real analysis fetch once that API is wired up.
  const { tradeId } = useLocalSearchParams<{ tradeId: string }>();

  return (
    <ReportDetail grade="A" onBack={() => router.replace('/(tabs)/journal')} />
  );
}
