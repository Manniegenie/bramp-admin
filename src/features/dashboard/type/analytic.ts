// User related types
export interface DashboardUsers {
  total: number
  emailVerified: number
  bvnVerified: number
  chatbotVerified: number
}

// Transaction Statistics
export interface TransactionStats {
  total: number
  deposits: number
  withdrawals: number
  swaps: number
  giftcards: number
  completed: number
  pending: number
  failed: number
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

// Recent Activity (24h)
export interface RecentActivity {
  transactions: number
  deposits: number
  withdrawals: number
  swaps: number
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
  type: string;
  status: string;
  currency: string;
  amount: number;
  fee?: number;
  narration?: string;
  reference?: string;
  source?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  // Swap fields
  fromCurrency?: string;
  toCurrency?: string;
  fromAmount?: number;
  toAmount?: number;
  swapType?: string;
  exchangeRate?: number;
  // Withdrawal fields
  bankName?: string;
  accountName?: string;
  accountNumberMasked?: string;
  withdrawalFee?: number;
  // Transfer fields
  recipientUsername?: string;
  senderUsername?: string;
  // Giftcard fields
  cardType?: string;
  country?: string;
  expectedRate?: number;
  // Chatbot transaction fields
  kind?: string;
  paymentId?: string;
  webhookRef?: string;
  token?: string;
  network?: string;
  sellAmount?: number;
  originalAmount?: number;
  originalCurrency?: string;
  quoteRate?: number;
  receiveCurrency?: string;
  receiveAmount?: number;
  actualReceiveAmount?: number;
  actualRate?: number;
  depositAddress?: string;
  depositMemo?: string;
  observedAmount?: number;
  observedTxHash?: string;
  observedAt?: string;
  payout?: {
    bankName?: string;
    bankCode?: string;
    accountNumber?: string;
    accountName?: string;
    capturedAt?: string;
  };
  payoutStatus?: string;
  expiresAt?: string;
  transactionType?: string;
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
  | 'SWAP'
  | 'OBIEX_SWAP'
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'GIFTCARD'
  | 'INTERNAL_TRANSFER_SENT'
  | 'INTERNAL_TRANSFER_RECEIVED'
  | 'SELL'
  | 'BUY'

export type TransactionStatus =
  | 'SUCCESSFUL'
  | 'COMPLETED'
  | 'CONFIRMED'
  | 'PENDING'
  | 'FAILED'
  | 'EXPIRED'

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