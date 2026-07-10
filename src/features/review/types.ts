export type TradeGrade = 'S' | 'A' | 'B' | 'C' | 'F';

export type RuleSetQueryType = 'template' | 'custom';
export type RuleSetType = 'TEMPLATE' | 'CUSTOM';
export type RuleDirection = 'BUY' | 'SELL';

export interface Rule {
  ruleId: number;
  type: RuleDirection;
  content: string;
  orderIndex: number;
}

export interface RuleSet {
  ruleSetId: number;
  name: string;
  description: string;
  type: RuleSetType;
  createdAt: string;
  buyRules: Rule[];
  sellRules: Rule[];
}

export type AiReportStatus = 'PENDING' | string;

export interface RecommendedRule {
  type: string;
  content: string;
}

export interface AiReport {
  aiReportId: number;
  tradeId: number;
  status: AiReportStatus;
  // The backend leaves these null while the report hasn't finished generating
  // (and possibly even briefly after status stops being 'PENDING'), so treat
  // all of them as optional at this API boundary.
  grade: TradeGrade | null;
  complianceRate: number | null;
  hashtags: string[] | null;
  goodPoints: string[] | null;
  badPoints: string[] | null;
  recommendedRule: RecommendedRule | null;
}

export interface Review {
  id: string;
  content: string;
  createdAt: string;
}

export interface CreateReviewInput {
  content: string;
}

export interface PrincipleSet {
  id: string;
  name: string;
  description: string;
  buyCount: number;
  sellCount: number;
  principles: Principle[];
}

export interface Principle {
  id: string;
  type: 'buy' | 'sell';
  order: number;
  content: string;
}

export interface PrincipleAnswer {
  principleId: string;
  score: number | null;
  reviewContent: string;
  links: ReviewLink[];
  photos: string[];
}

export interface ReviewLink {
  url: string;
  title: string;
  summary: string;
}
