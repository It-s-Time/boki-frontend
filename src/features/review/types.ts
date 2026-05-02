export interface Review {
  id: string;
  content: string;
  createdAt: string;
}

export interface CreateReviewInput {
  content: string;
}
