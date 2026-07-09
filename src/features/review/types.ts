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
  grade: TradeGrade;
  complianceRate: number;
  hashtags: string[];
  goodPoints: string[];
  badPoints: string[];
  recommendedRule: RecommendedRule;
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
