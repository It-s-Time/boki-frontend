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
}
