import { KlineData, KlineObj } from "./../../../models/binance/kline.ts";
export function mapKlineDataToObj(data: KlineData): KlineObj {
  const obj: KlineObj = {
    openTime: Number(data.k.t),
    open: Number(data.k.o),
    high: Number(data.k.h),
    low: Number(data.k.l),
    close: Number(data.k.c),
    baseVolume: Number(data.k.v),
    closeTime: Number(data.k.T),
    quoteVolume: Number(data.k.q),
    numberOfTrades: Number(data.k.n),
    isCandleClosed: data.k.x,
    takerBuyBaseVolume: Number(data.k.V),
    takerBuyQuoteVolume: Number(data.k.Q),
    takerSellBaseVolume: Number(data.k.v) - Number(data.k.V),
    takerSellQuoteVolume: Number(data.k.q) - Number(data.k.Q),
    hlc3: (Number(data.k.o) + Number(data.k.l) + Number(data.k.c)) / 3,
  };
  return obj;
}
