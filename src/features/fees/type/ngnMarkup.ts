export interface MarkupRecord {
  markup: number;
  updatedAt?: string | null;
}

export interface MarkupResponse {
  success: boolean;
  message?: string;
  data?: MarkupRecord | null;
}

export interface RateRecord {
  rate: number;
  updatedAt?: string | null;
}

export interface RateResponse {
  success: boolean;
  message?: string;
  data?: RateRecord | null;
}
