import { useState } from 'react';
import {
  LayoutChangeEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { COLORS_NEW } from '@/shared/constants/colors';
import BottomSheetModal from '@/shared/components/BottomSheetModal';
import ConfirmModal from '@/shared/components/ConfirmModal';
import DateWheelPicker from '@/shared/components/DateWheelPicker';
import { COIN_NAMES } from '@/features/trade/constants';
import {
  useDeleteTrade,
  useUpdateTrade,
} from '@/features/trade/hooks/useTrades';
import type { Trade } from '@/features/trade/types';

type Props = {
  visible: boolean;
  trade: Trade;
  onClose: () => void;
};

type Mode = 'view' | 'edit';
type EditTradeType = 'buy' | 'sell';

// BottomSheetModal chrome above its children: handle (6) + handle marginBottom (12) + sheet paddingTop (12)
const SHEET_CHROME_HEIGHT = 30;
const DATE_MODAL_GAP = 24;

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
  const [sheetHeight, setSheetHeight] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tradeDate, setTradeDate] = useState(() => new Date(trade.tradedAt));
  const [pendingDate, setPendingDate] = useState(tradeDate);
  const [tradeType, setTradeType] = useState<EditTradeType>(
    trade.tradeType === 'BUY' ? 'buy' : 'sell',
  );
  const [price, setPrice] = useState(String(trade.price));
  const [totalAmount, setTotalAmount] = useState(String(trade.totalAmount));
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const updateTrade = useUpdateTrade();
  const deleteTrade = useDeleteTrade();

  const isManual = trade.externalTradeId === null;
  const coinName = COIN_NAMES[trade.coinType] ?? trade.coinType;

  const resetEditState = () => {
    setTradeDate(new Date(trade.tradedAt));
    setPendingDate(new Date(trade.tradedAt));
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

  const handleDelete = () => setDeleteConfirmVisible(true);

  const confirmDelete = () => {
    setDeleteConfirmVisible(false);
    deleteTrade.mutate(trade.tradeId, { onSuccess: handleClose });
  };

  const handleSheetLayout = (e: LayoutChangeEvent) => {
    setSheetHeight(e.nativeEvent.layout.height);
  };

  return (
    <>
      <BottomSheetModal visible={visible} onClose={handleClose}>
        <View onLayout={handleSheetLayout}>
          <View style={styles.header}>
            <Text style={styles.coinName}>{coinName}</Text>
            {mode === 'edit' ? (
              <Pressable
                style={[
                  styles.dateButton,
                  showDatePicker && styles.dateButtonActive,
                ]}
                onPress={() => {
                  setPendingDate(tradeDate);
                  setShowDatePicker(true);
                }}
              >
                <Feather
                  name="calendar"
                  size={20}
                  color={
                    showDatePicker ? COLORS_NEW.background : COLORS_NEW.border
                  }
                />
              </Pressable>
            ) : (
              <View
                style={[
                  styles.tradeBadge,
                  {
                    backgroundColor:
                      trade.tradeType === 'BUY'
                        ? COLORS_NEW.lightRed
                        : COLORS_NEW.lightBlue,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tradeBadgeText,
                    {
                      color:
                        trade.tradeType === 'BUY'
                          ? COLORS_NEW.upStrong
                          : COLORS_NEW.downStrong,
                    },
                  ]}
                >
                  {trade.tradeType === 'BUY' ? '매수' : '매도'}
                </Text>
              </View>
            )}
          </View>

          {mode === 'view' ? (
            <View style={styles.content}>
              <DetailRow
                label="가격"
                value={`${trade.price.toLocaleString()}원`}
              />
              <DetailRow
                label="총 거래금액"
                value={`${trade.totalAmount.toLocaleString()}원`}
              />
              <DetailRow
                label="수량"
                value={`${trade.quantity}${trade.coinType}`}
              />
              <DetailRow label="거래일자" value={formatDate(trade.tradedAt)} />

              {isManual ? (
                <View style={styles.actionRow}>
                  <Pressable style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </Pressable>
                  <Pressable
                    style={styles.primaryButtonSmall}
                    onPress={handleStartEdit}
                  >
                    <Text style={styles.primaryButtonSmallText}>수정</Text>
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
                      tradeType === 'sell' && {
                        color: COLORS_NEW.downStrong,
                      },
                    ]}
                  >
                    매도
                  </Text>
                </Pressable>
              </View>

              <View style={styles.field}>
                <Text style={styles.editLabel}>거래 가격 (원)</Text>
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
                <Text style={styles.editLabel}>총 거래 금액</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.input}
                    value={formatNumber(onlyDigits(totalAmount))}
                    onChangeText={(text) => setTotalAmount(onlyDigits(text))}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {updateTrade.isError && (
                <Text style={styles.submitError}>
                  저장에 실패했어요, 다시 시도해주세요
                </Text>
              )}

              <View style={styles.actionRow}>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => {
                    resetEditState();
                    setMode('view');
                  }}
                >
                  <Text style={styles.deleteButtonText}>취소</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.primaryButtonSmall,
                    (updateTrade.isPending || !price || !totalAmount) &&
                      styles.primaryButtonDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={updateTrade.isPending || !price || !totalAmount}
                >
                  <Text style={styles.primaryButtonSmallText}>저장</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </BottomSheetModal>

      <Modal
        visible={mode === 'edit' && showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Pressable
          style={styles.dateModalBackdrop}
          onPress={() => setShowDatePicker(false)}
        >
          <Pressable
            style={[
              styles.dateModalSheet,
              {
                marginBottom:
                  sheetHeight + SHEET_CHROME_HEIGHT + DATE_MODAL_GAP,
              },
            ]}
            onPress={() => {}}
          >
            <View style={styles.datePickerHeader}>
              <Pressable
                style={styles.datePickerCloseButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Feather name="x" size={20} color={COLORS_NEW.textPrimary} />
              </Pressable>
              <Pressable
                style={styles.datePickerConfirmButton}
                onPress={() => {
                  setTradeDate(pendingDate);
                  setShowDatePicker(false);
                }}
              >
                <Feather name="check" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
            <DateWheelPicker
              value={pendingDate}
              onChange={setPendingDate}
              itemHeight={56}
              fontSize={24}
              columnGap={32}
              yearColumnWidth={104}
              columnWidth={72}
              highlightFull
            />
          </Pressable>
        </Pressable>
      </Modal>

      <ConfirmModal
        visible={deleteConfirmVisible}
        title="거래 내역을 삭제할까요?"
        message="삭제하면 되돌릴 수 없어요."
        cancelLabel="취소"
        onCancel={() => setDeleteConfirmVisible(false)}
        confirmLabel="삭제"
        onConfirm={confirmDelete}
      />
    </>
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  coinName: {
    fontSize: 24,
    letterSpacing: -0.96,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-SemiBold',
  },
  tradeBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tradeBadgeText: {
    fontSize: 16,
    letterSpacing: -0.64,
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
    fontSize: 18,
    letterSpacing: -0.72,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },
  detailValue: {
    fontSize: 18,
    letterSpacing: -0.72,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
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
    letterSpacing: -0.56,
    color: COLORS_NEW.border,
    fontFamily: 'Pretendard-Regular',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  primaryButtonSmall: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: COLORS_NEW.fab,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  primaryButtonSmallText: {
    fontSize: 20,
    letterSpacing: -0.8,
    color: '#FFFFFF',
    fontFamily: 'Pretendard-Medium',
  },
  primaryButtonDisabled: {
    opacity: 0.4,
  },
  deleteButton: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: COLORS_NEW.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  deleteButtonText: {
    fontSize: 20,
    letterSpacing: -0.8,
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
  },
  dateButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: COLORS_NEW.lightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonActive: {
    backgroundColor: COLORS_NEW.border,
    borderColor: COLORS_NEW.border,
  },
  tradeTypeRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  tradeTypeBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
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
    fontFamily: 'Pretendard-Medium',
    fontSize: 20,
    letterSpacing: -0.8,
  },
  field: {
    gap: 8,
    marginTop: 16,
  },
  label: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Regular',
    fontSize: 18,
    letterSpacing: -0.72,
  },
  editLabel: {
    color: COLORS_NEW.textPrimary,
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    letterSpacing: -0.72,
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
    letterSpacing: -0.72,
  },
  dateModalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  dateModalSheet: {
    backgroundColor: COLORS_NEW.background,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  datePickerCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: COLORS_NEW.lightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerConfirmButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: COLORS_NEW.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitError: {
    color: COLORS_NEW.downStrong,
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    letterSpacing: -0.56,
    textAlign: 'center',
    marginTop: 16,
  },
});
