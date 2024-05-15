import { PublicTradeRecord } from "../../../models/bybit/public-trade-record.ts";

export function resetPublicTradeRecord(symbol: string): PublicTradeRecord {
  const obj: PublicTradeRecord = {
    symbol: symbol,
    closeTime: 0,
    numberOfTrades: 0,
    takerBuyBaseVolume: 0,
    takerBuyQuoteVolume: 0,
    takerSellBaseVolume: 0,
    takerSellQuoteVolume: 0,
  };
  return obj;
}
