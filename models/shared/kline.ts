import { FundingRate } from "../binance/funding-rate.ts";
import { LiquidationRecord } from "./liquidation-record.ts";
import { OpenInterest } from "./oi.ts";

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
  liquidations: LiquidationRecord;
  fr: FundingRate;
  oi: OpenInterest;
  vwap: { vwapValue: number; vwap1stDevUp: number; vwap1stDevDown: number };
  chMf: {
    chMfValue: number;
    chMfEma: number;
  };
  vo: {
    sellValue: number;
    buyValue: number;
  };
  vzo: number;
  cvd: number;
  changes: {
    priceChg: number;
    cvdChg: number;
    oiChg: number;
    volumeChg: number;
    avgTradeDayVolChg: number;
    avgTradeDayBuyVolChg: number;
    avgTradeDaySellVolChg: number;
    avgTradeDayTradesChg: number;
  };
  ratios: {
    liq24hRatio: number;
    volRatio2hTo24h: number;
    volSellRatio2hTo24h: number;
    volBuyRatio2hTo24h: number;
    tradesRatioTo24h: number;
  };
  avg: {
    avgTradeDayVol: number;
    avgTradeDayBuyVol: number;
    avgTradeDaySellVol: number;
    avgTradeDayTrades: number;
  };
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
