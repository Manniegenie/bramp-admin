export interface UserSummary {
  _id: string;
  email: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  kycLevel?: number;
  kycStatus?: string;
  emailVerified?: boolean;
  chatbotTransactionVerified?: boolean;
  createdAt?: string;
  lastBalanceUpdate?: string;
}

export interface UsersSummaryResponse {
  success: true;
  data: {
    users: UserSummary[];
    pagination: {
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    };
  };
}

export interface RemovePasswordResponse {
  message: string;
}

export interface Disable2FaResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    is2FAEnabled: boolean;
    is2FAVerified: boolean;
  };
}

export interface WalletEntry {
  address: string;
  network: string;
  walletReferenceId: string;
}

export interface FetchWalletsResponse {
  email: string;
  wallets: Record<string, WalletEntry>;
  balances: {
    [key: string]: number | undefined;
    btcBalance?: number;
    btcBalanceUSD?: number;
    ethBalance?: number;
    ethBalanceUSD?: number;
    totalPortfolioBalance?: number;
  };
}

export interface WipePendingResponse {
  success: boolean;
  message: string;
  [key: string]: unknown;
}

export type UserApiTypes = UserSummary | UsersSummaryResponse | RemovePasswordResponse;
