import { KlineObj } from "../../models/shared/kline.ts";
import { getPublicTradeBySymbol } from "./get-public-trade-by-symbol.ts";

export async function writePublicTradesToKline(
  timeframe: string,
  symbol: string,
  kline: KlineObj[]
) {
  const pt = await getPublicTradeBySymbol(timeframe, symbol);
  kline.forEach((k: KlineObj) => {
    pt.forEach((el) => {
      if (k.closeTime == el.closeTime) {
        pt.forEach((el) => {
          if (k.closeTime >= el.closeTime && el.closeTime > k.openTime) {
            k.numberOfTrades = el.numberOfTrades;
            k.takerBuyBaseVolume = el.takerBuyBaseVolume;
            k.takerSellBaseVolume = el.takerSellBaseVolume;
            k.takerBuyQuoteVolume = el.takerBuyQuoteVolume;
            k.takerSellQuoteVolume = el.takerSellQuoteVolume;
          }
        });
      }
    });
  });

  return kline;
}
