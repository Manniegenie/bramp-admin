// User related types
export interface DashboardUsers {
  total: number
  emailVerified: number
  bvnVerified: number
  chatbotVerified: number
}

// Transaction Statistics (now chatbot-only)
export interface TransactionStats {
  total: number
  sell: number
  buy: number
  completed: number
  pending: number
  expired: number
}

// Swap Statistics
export interface SwapStats {
  total: number
  onramps: number
  offramps: number
  cryptoToCrypto: number
  ngnzSwaps: number
  successful: number
  totalVolume: number
  totalFees: number
}

// NGNZ Withdrawal Statistics
export interface NgnzWithdrawalStats {
  total: number
  completed: number
  pending: number
  failed: number
  totalAmount: number
  totalBankAmount: number
  totalFees: number
}

// Recent Activity (24h) - now chatbot-only
export interface RecentActivity {
  transactions: number
  sellTransactions: number
  buyTransactions: number
  volume: number
}

// Chatbot Trades (for backward compatibility)
export interface ChatbotOverview {
  total: number
  sell: number
  buy: number
  completed: number
  pending: number
  expired: number
  cancelled: number
}

export interface ChatbotVolume {
  totalSellVolume: number
  totalBuyVolumeNGN: number
  totalReceiveAmount: number
}

export interface ChatbotSuccess {
  successfulPayouts: number
  successfulCollections: number
}

export interface ChatbotRecent24h {
  trades: number
  sellTrades: number
  buyTrades: number
  volume: number
}

export interface ChatbotTrades {
  overview: ChatbotOverview
  volume: ChatbotVolume
  success: ChatbotSuccess
  recent24h: ChatbotRecent24h
}

// Token Statistics
export interface TokenStat {
  _id: string
  tradeCount: number
  sellCount: number
  buyCount: number
  totalVolume: number
  transactionCount?: number
  deposits?: number
  withdrawals?: number
  swaps?: number
}

// Transaction Volume Breakdown
export interface CurrencyBreakdown {
  totalAmount: string
  usdValue: string
  price?: number
  note?: string
}

export interface TransactionVolumeCounts {
  totalCurrencies: number
  processedCurrencies: number
  skippedCurrencies: number
}

// Chatbot Transaction Statistics
export interface ChatbotTransactionStats {
  total: number
  sell: number
  buy: number
  completed: number
  pending: number
  expired: number
  volume: {
    totalSellVolume: number
    totalReceiveVolume: number
    totalActualReceiveVolume: number
  }
}

// Updated Dashboard Analytics Data
export interface DashboardAnalyticsData {
  users: DashboardUsers
  transactions?: TransactionStats
  chatbotTransactions?: ChatbotTransactionStats
  swapStats?: SwapStats
  ngnzWithdrawals?: NgnzWithdrawalStats
  recentActivity?: RecentActivity
  chatbotTrades: ChatbotTrades
  tokenStats: TokenStat[]
  transactionVolume: number
  transactionVolumeBreakdown?: Record<string, CurrencyBreakdown>
  transactionVolumeCounts?: TransactionVolumeCounts
  depositVolume: number
  depositVolumeBreakdown?: Record<string, CurrencyBreakdown>
  tradeVolumeNGN: number
  totalTrades: number
}

export interface DashboardAnalyticsResponse {
  success: boolean
  timestamp: string
  data: DashboardAnalyticsData
}

// Transaction types
export interface Transaction {
  id: string;
  userId?: string;
  username?: string;
  userEmail?: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'INTERNAL_TRANSFER_SENT' | 'INTERNAL_TRANSFER_RECEIVED' | 'SWAP' | 'GIFTCARD' | string;
  status: 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'SUCCESSFUL' | 'COMPLETED' | 'FAILED' | 'REJECTED' | 'APPROVED' | string;
  currency: string;
  amount: number;
  fee?: number;
  narration?: string;
  reference?: string;
  source?: string;
  network?: string;
  hash?: string;
  obiexTransactionId?: string;
  transactionId?: string;
  actualReceiveAmount?: number;
  metadata?: {
    requestedAmount?: number;
    totalDeducted?: number;
    failureReason?: string;
    refundedAt?: string;
    refundAmount?: number;
    ngnbCredited?: number;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  failedAt?: string;
}

export interface RecentTransactionsResponse {
  success: boolean;
  timestamp: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    limit: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  data: Transaction[];
}

// Filter related types
export interface FilterParams {
  searchTerm?: string
  dateFrom?: string
  dateTo?: string
  transactionType?: string
  transactionStatus?: string
  userVerificationStatus?: string
  currency?: string
  minAmount?: string
  maxAmount?: string
  page?: number
  limit?: number
}

export interface AppliedFilters {
  searchTerm: string | null
  dateFrom: string | null
  dateTo: string | null
  transactionType: string | null
  transactionStatus: string | null
  userVerificationStatus: string | null
  currency: string | null
  minAmount: string | null
  maxAmount: string | null
}

export interface FilterPagination {
  currentPage: number
  totalPages: number
  limit: number
  totalCount: number
  transactionCount: number
  userCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface AggregateStats {
  totalAmount: number
  totalFees: number
  avgAmount: number
  successfulCount: number
  pendingCount: number
  failedCount: number
}

export interface FilteredUser {
  id: string
  username: string
  email: string
  firstname: string
  lastname: string
  emailVerified: boolean
  bvnVerified: boolean
  chatbotVerified: boolean
  createdAt: string
}

export interface FilterResponse {
  success: boolean
  timestamp: string
  filters: AppliedFilters
  pagination: FilterPagination
  aggregateStats: AggregateStats
  data: {
    transactions: Transaction[]
    users: FilteredUser[]
  }
}

// Swap Pair Analytics
export interface SwapPairStat {
  swapPair: string
  totalSwaps: number
  totalVolume: number
  avgExchangeRate: number
  uniqueUsers: number
}

export interface SwapPairAnalyticsResponse {
  success: boolean
  timeframe: string
  data: SwapPairStat[]
}

// Type unions for type safety
export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'INTERNAL_TRANSFER_SENT'
  | 'INTERNAL_TRANSFER_RECEIVED'
  | 'SWAP'
  | 'GIFTCARD'

export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'CONFIRMED'
  | 'SUCCESSFUL'
  | 'COMPLETED'
  | 'FAILED'
  | 'REJECTED'
  | 'APPROVED'

export type UserVerificationStatus =
  | 'emailVerified'
  | 'bvnVerified'
  | 'chatbotVerified'
  | 'unverified'

export type SwapType =
  | 'onramp'
  | 'ONRAMP'
  | 'offramp'
  | 'OFFRAMP'
  | 'crypto_to_crypto'
  | 'CRYPTO_TO_CRYPTO'
  | 'NGNX_TO_CRYPTO'
  | 'CRYPTO_TO_NGNX'