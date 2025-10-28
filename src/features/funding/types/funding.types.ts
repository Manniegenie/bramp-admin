export interface FundUserRequest {
  email: string;
  amount: number;
  currency: string;
}

export interface FundUserResponse {
  success: boolean;
  message: string;
  newBalance: number;
  totalPortfolioBalance: number;
}
