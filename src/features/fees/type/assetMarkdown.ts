export interface GlobalMarkdownRecord {
  markdownPercentage: number;
  formattedPercentage?: string;
  description?: string | null;
  isActive?: boolean;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export interface GlobalMarkdownResponse {
  success: boolean;
  message?: string;
  data?: GlobalMarkdownRecord | null;
}

export interface CalculatePriceRecord {
  asset: string;
  originalPrice: number;
  markdownPercentage: number;
  formattedPercentage?: string;
  discountAmount: number;
  discountedPrice: number;
  isActive: boolean;
  calculatedAt?: string | null;
}

export interface CalculatePriceResponse {
  success: boolean;
  message?: string;
  data?: CalculatePriceRecord | null;
}
