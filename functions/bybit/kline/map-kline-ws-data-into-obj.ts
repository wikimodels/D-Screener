import { KlineData } from "../../../models/bybit/kline-data.ts";
import { KlineObj } from "../../../models/shared/kline.ts";

export function mapKlineWsDataIntoObj(data: KlineData, symbol: string) {
  const obj: KlineObj = {
    symbol: symbol,
    openTime: Number(data.start),
    closeTime: Number(data.end),
    close: Number(data.close),
    open: Number(data.open),
    high: Number(data.high),
    low: Number(data.low),
    baseVolume: Number(data.volume),
    quoteVolume: Number(0),
    numberOfTrades: Number(0),
    isCandleClosed: data.confirm,
    takerBuyBaseVolume: Number(0),
    takerBuyQuoteVolume: Number(0),
    takerSellBaseVolume: Number(0) - Number(0),
    takerSellQuoteVolume: Number(0) - Number(0),
    hlc3: (Number(data.open) + Number(data.low) + Number(data.close)) / 3,
    isHammer: false,
    isPinbar: false,
    liquidations: {
      closeTime: 0,
      buy: {
        liqSum: 0,
        counter: 0,
      },
      sell: {
        liqSum: 0,
        counter: 0,
      },
      symbol: symbol,
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
