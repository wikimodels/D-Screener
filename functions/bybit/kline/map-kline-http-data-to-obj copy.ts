import { KlineObj } from "../../../models/shared/kline.ts";

export function mapKlineHttpDataToObj(
  data: any[],
  symbol: string,
  timeframeInMin: number
): KlineObj {
  const obj: KlineObj = {
    symbol: symbol,
    openTime: Number(data[0]),
    closeTime: calculateCloseTime(Number(data[0]), timeframeInMin),
    open: Number(data[1]),
    high: Number(data[2]),
    low: Number(data[3]),
    close: Number(data[4]),
    baseVolume: Number(data[5]),
    quoteVolume: Number(data[6]),
    numberOfTrades: 0,
    isHammer: false,
    isPinbar: false,
    isCandleClosed: false,
    takerBuyBaseVolume: Number(data[9]),
    takerBuyQuoteVolume: Number(data[10]),
    takerSellBaseVolume: Number(data[5]) - Number(data[9]),
    takerSellQuoteVolume: Number(data[7]) - Number(data[10]),
    hlc3: (Number(data[2]) + Number(data[3]) + Number(data[4])) / 3,
    liquidations: {
      buy: { liqSum: 0, counter: 0 },
      sell: { liqSum: 0, counter: 0 },
      symbol: symbol,
      closeTime: 0,
    },
    oi: {
      symbol: symbol,
      oiValue: 0,
      timestamp: 0,
      closeTime: 0,
    },
    fr: {
      fr: 0,
      nextFundingTime: 0,
      closeTime: 0,
      symbol: symbol,
    },
    vwapDaily: { vwapValue: 0, vwap1stDevUp: 0, vwap1stDevDown: 0 },
    vwapWeekly: { vwapValue: 0, vwap1stDevUp: 0, vwap1stDevDown: 0 },
    chMf: { chMfValue: 0, chMfEma: 0 },
    vo: { sellValue: 0, buyValue: 0 },
    vzo: 0,
    cvd: 0,
    changes: {
      priceChg: 0,
      cvdChg: 0,
      oiChg: 0,
      volumeChg: 0,
      avgTradeDayVolChg: 0,
      avgTradeDayBuyVolChg: 0,
      avgTradeDaySellVolChg: 0,
      avgTradeDayTradesChg: 0,
    },
    ratios: {
      liq24hRatio: 0,
      volRatio2hTo24h: 0,
      volSellRatio2hTo24h: 0,
      volBuyRatio2hTo24h: 0,
      tradesRatioTo24h: 0,
    },
    avg: {
      avgTradeDayVol: 0,
      avgTradeDayBuyVol: 0,
      avgTradeDaySellVol: 0,
      avgTradeDayTrades: 0,
    },
  };
  return obj;
}

function calculateCloseTime(openTime: number, timeframeInMin: number): number {
  return openTime + timeframeInMin * 60 * 1000 - 1;
}
