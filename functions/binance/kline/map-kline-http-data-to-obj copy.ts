import { KlineObj } from "../../../models/binance/kline.ts";

export function mapKlineHttpDataToObj(data: any[], symbol: string): KlineObj {
  const obj: KlineObj = {
    symbol: symbol,
    openTime: Number(data[0]),
    closeTime: Number(data[6]),
    open: Number(data[1]),
    high: Number(data[2]),
    low: Number(data[3]),
    close: Number(data[4]),
    baseVolume: Number(data[5]),
    quoteVolume: Number(data[7]),
    numberOfTrades: Number(data[8]),
    isHammer: false,
    isPinbar: false,
    isCandleClosed: false,
    takerBuyBaseVolume: Number(data[9]),
    takerBuyQuoteVolume: Number(data[10]),
    takerSellBaseVolume: Number(data[5]) - Number(data[9]),
    takerSellQuoteVolume: Number(data[7]) - Number(data[10]),
    hlc3: (Number(data[2]) + Number(data[3]) + Number(data[4])) / 3,
    liquidations: {
      buy: { liqSum: 0, counter: 0, isUpdated: false },
      sell: { liqSum: 0, counter: 0, isUpdated: false },
    },
    oi: {
      timestamp: 0,
      isUpdated: false,
      sumOpenInterest: 0,
      sumOpenInterestValue: 0,
    },
    fr: {
      fundingRate: 0,
      nextFundingTime: 0,
    },
    vwap: { vwapValue: 0, vwap1stDevUp: 0, vwap1stDevDown: 0 },
  };
  return obj;
}
