export interface PublicTradeRecord {
  symbol: string;
  closeTime: number;
  numberOfTrades: number;
  takerBuyBaseVolume: number;
  takerBuyQuoteVolume: number;
  takerSellBaseVolume: number;
  takerSellQuoteVolume: number;
}
