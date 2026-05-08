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
  createdAt: string;
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
