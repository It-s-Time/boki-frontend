import { ComponentType, createElement } from 'react';
import { Image } from 'react-native';
import { PrincipleSet } from './types';
import BuyPrincipleIcon1 from '../../../assets/icons/reivew/buy-principe1.svg';
import BuyPrincipleIcon3 from '../../../assets/icons/reivew/buy-principle3.svg';

// buy-principle2/sell-principle1/sell-principle3 were exported as SVGs that
// just embed a giant base64 PNG (no real vector paths), which bloated the
// Metro/Babel SVG transform. They're plain images now, wrapped to match the
// same width/height-only component shape as the real SVG icons above.
const buyPrincipleImage2 = require('../../../assets/icons/reivew/buy-principle2.png');
const sellPrincipleImage1 = require('../../../assets/icons/reivew/sell-principle1.png');
const sellPrincipleImage3 = require('../../../assets/icons/reivew/sell-principle3.png');

type IllustrationProps = { width?: number; height?: number };

function createRasterIcon(source: number): ComponentType<IllustrationProps> {
  return function RasterIcon({ width, height }: IllustrationProps) {
    return createElement(Image, { source, style: { width, height } });
  };
}

const BuyPrincipleIcon2 = createRasterIcon(buyPrincipleImage2);
const SellPrincipleIcon1 = createRasterIcon(sellPrincipleImage1);
const SellPrincipleIcon3 = createRasterIcon(sellPrincipleImage3);

interface PrincipleIllustration {
  Icon: ComponentType<IllustrationProps>;
  width: number;
  height: number;
}

export const PRINCIPLE_ILLUSTRATIONS: Record<
  'buy' | 'sell',
  Record<number, PrincipleIllustration>
> = {
  buy: {
    1: { Icon: BuyPrincipleIcon1, width: 189, height: 220 },
    2: { Icon: BuyPrincipleIcon2, width: 200, height: 220 },
    3: { Icon: BuyPrincipleIcon3, width: 250, height: 195 },
  },
  sell: {
    1: { Icon: SellPrincipleIcon1, width: 220, height: 220 },
    2: { Icon: BuyPrincipleIcon2, width: 200, height: 220 },
    3: { Icon: SellPrincipleIcon3, width: 220, height: 142 },
  },
};

// Fallback template principle sets, used while /api/rule-sets has no TEMPLATE data seeded yet.
export const PRINCIPLE_SETS: PrincipleSet[] = [
  {
    id: 'short-term',
    name: '단기 투자형',
    description: '1개월 이내',
    buyCount: 3,
    sellCount: 3,
    principles: [
      {
        id: 'b1',
        type: 'buy',
        order: 1,
        content: '급등 뉴스나 이슈 터진 직후 추격 매수 안 하기',
      },
      {
        id: 'b2',
        type: 'buy',
        order: 2,
        content: '매수 전에 목표 수익률과 손절선을 미리 정하기',
      },
      {
        id: 'b3',
        type: 'buy',
        order: 3,
        content: '한 번에 몰빵하지 않고 정해둔 금액만큼만 매수',
      },
      {
        id: 's1',
        type: 'sell',
        order: 1,
        content: '목표 수익률 도달하면 욕심 안 부리고 매도',
      },
      {
        id: 's2',
        type: 'sell',
        order: 2,
        content: '손절 선 닿으면 무조건 매도',
      },
      {
        id: 's3',
        type: 'sell',
        order: 3,
        content: '산 이유가 사라지면 바로 매도',
      },
    ],
  },
  {
    id: 'mid-term',
    name: '중기 투자형',
    description: '1개월부터 6개월 이내',
    buyCount: 3,
    sellCount: 3,
    principles: [
      {
        id: 'b1',
        type: 'buy',
        order: 1,
        content: '많이 떨어졌을 때 한 번에 사지 않고 나눠서 매수',
      },
      {
        id: 'b2',
        type: 'buy',
        order: 2,
        content: '전체 자산의 일정 비율 이상은 코인에 안 넣기',
      },
      {
        id: 'b3',
        type: 'buy',
        order: 3,
        content: '최근 급등한 코인은 일단 지켜보고 매수 보류',
      },
      {
        id: 's1',
        type: 'sell',
        order: 1,
        content: '정해둔 수익률 도달하면 일부 매도',
      },
      {
        id: 's2',
        type: 'sell',
        order: 2,
        content: '사고나서 생각이 바뀌면 비중 줄이기',
      },
      {
        id: 's3',
        type: 'sell',
        order: 3,
        content: '많이 빠질 때 손실 키우지 않고 일부 매도',
      },
    ],
  },
  {
    id: 'long-term',
    name: '장기 투자형',
    description: '6개월 이상',
    buyCount: 3,
    sellCount: 3,
    principles: [
      {
        id: 'b1',
        type: 'buy',
        order: 1,
        content: '잘 아는 코인, 믿는 코인만 사기',
      },
      {
        id: 'b2',
        type: 'buy',
        order: 2,
        content: '매달 정해진 날짜에 정해진 금액만 사기',
      },
      {
        id: 'b3',
        type: 'buy',
        order: 3,
        content: '가격 급등락에 흔들려서 추가 결정 안 하기',
      },
      {
        id: 's1',
        type: 'sell',
        order: 1,
        content: '목표한 기간이 되기 전에는 함부로 안 팔기',
      },
      {
        id: 's2',
        type: 'sell',
        order: 2,
        content: '급등 후 팔지 않고 처음 목표 도달할 때만 팔기',
      },
      {
        id: 's3',
        type: 'sell',
        order: 3,
        content: '급하게 돈이 필요한 상황 아니면 패닉셀 안 하기',
      },
    ],
  },
];
