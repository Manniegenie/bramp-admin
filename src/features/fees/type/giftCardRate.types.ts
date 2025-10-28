export interface GiftCardRate {
  id: string;
  cardType: string;
  country: string;
  rate: number;
  rateDisplay: string;
  isActive: boolean;
  createdAt: string;
}

export interface GiftCardRatesResponse {
  success: boolean;
  data: {
    rates: GiftCardRate[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRates: number;
      limit: number;
    };
  };
  message: string;
}