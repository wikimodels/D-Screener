export interface KlineObj {
  symbol: string;
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  isHammer: boolean;
  isPinbar: boolean;
  baseVolume: number;
  closeTime: number;
  quoteVolume: number;
  numberOfTrades: number;
  isCandleClosed: boolean;
  takerBuyBaseVolume: number;
  takerBuyQuoteVolume: number;
  takerSellBaseVolume: number;
  takerSellQuoteVolume: number;
  hlc3: number;
  liquidations: {
    buy: {
      liqSum: number;
      counter: number;
    };
    sell: {
      liqSum: number;
      counter: number;
    };
  };
  fr: {
    fundingRate: number;
    nextFundingTime: number;
  };
  oi: {
    sumOpenInterest: number;
    sumOpenInterestValue: number;
  };
  vwap: { vwapValue: number; vwap1stDevUp: number; vwap1stDevDown: number };
}

export interface KlineData {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  k: {
    t: number; // Kline start time
    T: number; // Kline close time
    s: string; // Symbol
    i: string; // Interval
    f: number; // First trade ID
    L: number; // Last trade ID
    o: number; // Open price
    c: number; // Close price
    h: number; // High price
    l: number; // Low price
    v: number; // Base asset volume
    n: number; // Number of trades
    x: boolean; // Is this kline closed?
    q: number; // Quote asset volume
    V: number; // Taker buy base asset volume
    Q: number; // Taker buy quote asset volume
    B: number; // Ignore
  };
}
