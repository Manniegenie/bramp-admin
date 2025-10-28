export interface CryptoFee {
  currency: string;
  network: string;
  networkName: string;
  networkFee: number;
}

export interface CryptoFeesResponse {
  message: string;
  data: CryptoFee[];
  count: number;
}

export interface CryptoFeeResponse {
  message: string;
  data: CryptoFee;
}

export interface CryptoFeeUpdateResponse {
  message: string;
  data: CryptoFee & { createdAt?: string; updatedAt?: string };
}