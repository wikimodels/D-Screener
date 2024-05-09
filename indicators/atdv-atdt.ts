import { KlineObj } from "../models/binance/kline.ts";
export function calculateAtdvAtdt(klineObjs: KlineObj[], timeframe: string) {
  const windowSize = timeframe == "1h" ? 24 : 24 * 15;
  if (windowSize > klineObjs.length) {
    throw Error("WindowSize cannot be shorter than Kline Obj Length");
  }
  for (let i = windowSize - 1; i < klineObjs.length; i++) {
    let avgTradeDayVolSum: number = 0;
    let avgTradeDayBuyVolSum: number = 0;
    let avgTradeDaySellVolSum: number = 0;
    let avgTradeDayTradesSum: number = 0;

    for (let j = i - (windowSize - 1); j <= i; j++) {
      console.log(`j=${j} i=${i}`);
      avgTradeDayVolSum += klineObjs[j].baseVolume;
      avgTradeDayBuyVolSum += klineObjs[j].takerBuyBaseVolume;
      avgTradeDaySellVolSum += klineObjs[j].takerSellBaseVolume;
      avgTradeDayTradesSum += klineObjs[j].numberOfTrades;
    }
    klineObjs[i].avgTradeDayVol = avgTradeDayVolSum / windowSize;
    klineObjs[i].avgTradeDayBuyVol = avgTradeDayBuyVolSum / windowSize;
    klineObjs[i].avgTradeDaySellVol = avgTradeDaySellVolSum / windowSize;
    klineObjs[i].avgTradeDayTrades = avgTradeDayTradesSum / windowSize;
  }
  return klineObjs;
}
