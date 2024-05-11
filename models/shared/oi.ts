export interface OpenInterestHist {
  symbol: string;
  sumOpenInterest: number;
  sumOpenInterestValue: number;
  timestamp: number;
}

export interface OpenInterestData {
  symbol: string;
  openInterest: number;
  time: number;
}

export interface OpenInterest {
  symbol: string;
  oiValue: number;
  timestamp: number;
  closeTime: number;
}
