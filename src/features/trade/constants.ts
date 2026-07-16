export const COIN_NAMES: Record<string, string> = {
  BTC: '비트코인',
  XRP: '리플',
  ETH: '이더리움',
  SOL: '솔라나',
};

// Manual trades store a bare symbol ("BTC"), but exchange-synced trades
// store Upbit's full market code ("KRW-BTC") — normalize to the bare
// symbol before looking it up in COIN_NAMES/COIN_ICONS or displaying it.
export const getCoinSymbol = (coinType: string) => {
  const parts = coinType.split('-');
  return parts[parts.length - 1];
};
