import { KlineData, KlineObj } from "../../../models/binance/kline.ts";

export function mapKlineWsDataIntoObj(data: KlineData) {
  const obj: KlineObj = {
    symbol: data.s,
    openTime: Number(data.k.t),
    closeTime: Number(data.k.T),
    close: Number(data.k.c),
    open: Number(data.k.o),
    high: Number(data.k.h),
    low: Number(data.k.l),
    baseVolume: Number(data.k.v),
    quoteVolume: Number(data.k.q),
    numberOfTrades: Number(data.k.n),
    isCandleClosed: data.k.x,
    takerBuyBaseVolume: Number(data.k.V),
    takerBuyQuoteVolume: Number(data.k.Q),
    takerSellBaseVolume: Number(data.k.v) - Number(data.k.V),
    takerSellQuoteVolume: Number(data.k.q) - Number(data.k.Q),
    hlc3: (Number(data.k.o) + Number(data.k.l) + Number(data.k.c)) / 3,
    isHammer: false,
    isPinbar: false,
    liquidations: {
      buy: {
        liqSum: 0,
        counter: 0,
      },
      sell: {
        liqSum: 0,
        counter: 0,
      },
      symbol: data.s,
    },
    oi: {
      symbol: data.s,
      oiValue: 0,
      timestamp: 0,
      closeTime: 0,
    },
    fr: {
      fr: 0,
      nextFundingTime: 0,
      closeTime: 0,
      symbol: data.s,
    },
    vwap: { vwapValue: 0, vwap1stDevUp: 0, vwap1stDevDown: 0 },
    chMf: { chMfValue: 0, chMfEma: 0 },
  };
  return obj;
}
