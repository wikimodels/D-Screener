export interface MarkPriceUpdateData {
  e: string;
  E: number;
  s: string;
  p: number;
  i: number;
  P: number;
  r: number;
  T: number;
}

export interface MarkPriceUpdateObj {
  eventType: string;
  eventTime: number;
  symbol: string;
  markPrice: number;
  indexPrice: number;
  estimatedPrice: number;
  fundingRate: number;
  nextFundingTime: number;
}
