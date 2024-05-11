export interface PublicTradeRecord {
  symbol: string;
  numberOfTrades: number;
  takerBuyBaseVolume: number;
  takerBuyQuoteVolume: number;
  takerSellBaseVolume: number;
  takerSellQuoteVolume: number;
  closeTime: number;
}
