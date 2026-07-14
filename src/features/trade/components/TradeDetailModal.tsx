import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS_NEW } from '@/shared/constants/colors';
import BottomSheetModal from '@/shared/components/BottomSheetModal';
import PrimaryButton from '@/shared/components/PrimaryButton';
import DateWheelPicker from '@/shared/components/DateWheelPicker';
import { COIN_NAMES } from '@/features/trade/constants';
import { useDeleteTrade, useUpdateTrade } from '@/features/trade/hooks/useTrades';
import type { Trade } from '@/features/trade/types';

type Props = {
  visible: boolean;
  trade: Trade;
  onClose: () => void;
};

type Mode = 'view' | 'edit';
type EditTradeType = 'buy' | 'sell';

const onlyDigits = (text: string) => text.replace(/[^0-9]/g, '');
const formatNumber = (digits: string) =>
  digits ? Number(digits).toLocaleString() : '';

function formatDate(tradedAt: string) {
  const d = new Date(tradedAt);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

export default function TradeDetailModal({ visible, trade, onClose }: Props) {
  const [mode, setMode] = useState<Mode>('view');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tradeDate, setTradeDate] = useState(() => new Date(trade.tradedAt));
  const [tradeType, setTradeType] = useState<EditTradeType>(
    trade.tradeType === 'BUY' ? 'buy' : 'sell',
  );
  const [price, setPrice] = useState(String(trade.price));
  const [totalAmount, setTotalAmount] = useState(String(trade.totalAmount));

  const updateTrade = useUpdateTrade();
  const deleteTrade = useDeleteTrade();

  const isManual = trade.externalTradeId === null;
  const coinName = COIN_NAMES[trade.coinType] ?? trade.coinType;

  const resetEditState = () => {
    setTradeDate(new Date(trade.tradedAt));
    setTradeType(trade.tradeType === 'BUY' ? 'buy' : 'sell');
    setPrice(String(trade.price));
    setTotalAmount(String(trade.totalAmount));
    setShowDatePicker(false);
  };

  const handleClose = () => {
    setMode('view');
    resetEditState();
    onClose();
  };

  const handleStartEdit = () => {
    resetEditState();
    setMode('edit');
  };

  const handleSave = () => {
    const original = new Date(trade.tradedAt);
    const tradedAt = new Date(
      tradeDate.getFullYear(),
      tradeDate.getMonth(),
      tradeDate.getDate(),
      original.getHours(),
      original.getMinutes(),
    );
    const pad = (n: number) => String(n).padStart(2, '0');
    const tradedAtStr = `${tradedAt.getFullYear()}-${pad(tradedAt.getMonth() + 1)}-${pad(
      tradedAt.getDate(),
    )}T${pad(tradedAt.getHours())}:${pad(tradedAt.getMinutes())}:00`;

    updateTrade.mutate(
      {
        tradeId: trade.tradeId,
        data: {
          coinType: trade.coinType,
          tradeType: tradeType === 'buy' ? 'BUY' : 'SELL',
          price: Number(price),
          totalAmount: Number(totalAmount),
          tradedAt: tradedAtStr,
        },
      },
      { onSuccess: () => setMode('view') },
    );
  };

  const handleDelete = () => {
    Alert.alert('거래 내역을 삭제할까요?', '삭제하면 되돌릴 수 없어요.', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteTrade.mutate(trade.tradeId, { onSuccess: handleClose }),
      },
    ]);
  };

  return (
    <BottomSheetModal visible={visible} onClose={handleClose}>
      <View style={styles.header}>
        <Text style={styles.coinName}>{coinName}</Text>
        <View
          style={[
            styles.tradeBadge,
            {
              backgroundColor:
                trade.tradeType === 'BUY' ? COLORS_NEW.lightRed : COLORS_NEW.lightBlue,
            },
          ]}
        >
          <Text
            style={[
              styles.tradeBadgeText,
              { color: trade.tradeType === 'BUY' ? COLORS_NEW.upStrong : COLORS_NEW.downStrong },
            ]}
          >
            {trade.tradeType === 'BUY' ? '매수' : '매도'}
          </Text>
        </View>
      </View>

      {mode === 'view' ? (
        <View style={styles.content}>
          <DetailRow label="수량" value={`${trade.quantity}${trade.coinType}`} />
          <DetailRow label="가격" value={`${trade.price.toLocaleString()}원`} />
          <DetailRow
            label="총 거래금액"
            value={`${trade.totalAmount.toLocaleString()}원`}
          />
          <DetailRow label="거래일자" value={formatDate(trade.tradedAt)} />

          {isManual ? (
            <View style={styles.actionRow}>
              <Pressable style={styles.primaryButtonSmall} onPress={handleStartEdit}>
                <Text style={styles.primaryButtonSmallText}>수정</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={handleDelete}>
                <Text style={styles.secondaryButtonText}>삭제</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>
                업비트에서 연동된 거래는 수정할 수 없어요
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.tradeTypeRow}>
            <Pressable
              style={[
                styles.tradeTypeBox,
                tradeType === 'buy' && styles.tradeTypeBoxBuy,
              ]}
              onPress={() => setTradeType('buy')}
            >
              <Text
                style={[
                  styles.tradeTypeText,
                  tradeType === 'buy' && { color: COLORS_NEW.upStrong },
                ]}
              >
                매수
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tradeTypeBox,
                tradeType === 'sell' && styles.tradeTypeBoxSell,
              ]}
              onPress={() => setTradeType('sell')}
            >
              <Text
                style={[
                  styles.tradeTypeText,
                  tradeType === 'sell' && { color: COLORS_NEW.downStrong },
                ]}
              >
                매도
              </Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>가격 (원)</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={formatNumber(onlyDigits(price))}
                onChangeText={(text) => setPrice(onlyDigits(text))}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>총 거래금액</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={formatNumber(onlyDigits(totalAmount))}
                onChangeText={(text) => setTotalAmount(onlyDigits(text))}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>거래일자</Text>
            <Pressable
              style={styles.inputBox}
              onPress={() => setShowDatePicker((v) => !v)}
            >
              <Text style={styles.input}>{formatDate(tradeDate.toISOString())}</Text>
            </Pressable>
            {showDatePicker && (
              <View style={styles.datePickerPanel}>
                <DateWheelPicker value={tradeDate} onChange={setTradeDate} />
              </View>
            )}
          </View>

          {updateTrade.isError && (
            <Text style={styles.submitError}>저장에 실패했어요, 다시 시도해주세요</Text>
          )}

          <View style={styles.actionRow}>
            <PrimaryButton
              label="저장"
              onPress={handleSave}
              disabled={updateTrade.isPending || !price || !totalAmount}
              style={styles.saveButton}
            />
            <Pressable
              style={styles.secondaryButton}
              onPress={() => {
                resetEditState();
                setMode('view');
              }}
            >
              <Text style={styles.secondaryButtonText}>취소</Text>
            </Pressable>
          </View>
        </View>
      )}
    </BottomSheetModal>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  coinName: {
    fontSize: 22,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },
  tradeBadge: {
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tradeBadgeText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
  },
  content: {
    paddingBottom: 32,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS_NEW.lightBorder,
  },
  detailLabel: {
    fontSize: 15,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },
  detailValue: {
    fontSize: 15,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },
  noticeBox: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: COLORS_NEW.lightGray,
    alignItems: 'center',
  },
  noticeText: {
    fontSize: 14,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },
  primaryButtonSmall: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: COLORS_NEW.fab,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  primaryButtonSmallText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },
  saveButton: {
    flex: 1,
  },
  tradeTypeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  tradeTypeBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
  },
  tradeTypeBoxBuy: {
    backgroundColor: COLORS_NEW.lightRed,
    borderColor: COLORS_NEW.lightRed,
  },
  tradeTypeBoxSell: {
    backgroundColor: COLORS_NEW.lightBlue,
    borderColor: COLORS_NEW.lightBlue,
  },
  tradeTypeText: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
  },
  field: {
    gap: 8,
    marginTop: 16,
  },
  label: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS_NEW.background,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
    padding: 0,
    fontSize: 18,
  },
  datePickerPanel: {
    alignSelf: 'center',
    backgroundColor: COLORS_NEW.background,
    borderWidth: 1,
    borderColor: COLORS_NEW.lightBorder,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  submitError: {
    color: COLORS_NEW.downStrong,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
});
