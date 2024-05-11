import { KlineObj } from "../models/shared/kline.ts";
export function calculateAtdvAtdt(klineObjs: KlineObj[], timeframe: string) {
  const windowSize = timeframe == "1h" ? 24 : 24 * 15;
  if (windowSize > klineObjs.length) {
    throw Error("WindowSize cannot be shorter than Kline Obj Length");
  }
  for (let i = windowSize - 1; i < klineObjs.length; i++) {
    let volSum: number = 0;
    let buyVolSum: number = 0;
    let sellVolSum: number = 0;
    let tradesSum: number = 0;

    for (let j = i - (windowSize - 1); j <= i; j++) {
      console.log(`j=${j} i=${i}`);
      volSum += klineObjs[j].baseVolume;
      buyVolSum += klineObjs[j].takerBuyBaseVolume;
      sellVolSum += klineObjs[j].takerSellBaseVolume;
      tradesSum += klineObjs[j].numberOfTrades;
    }
    klineObjs[i].avg.avgTradeDayVol = Math.round(volSum / windowSize);
    klineObjs[i].avg.avgTradeDayBuyVol = Math.round(buyVolSum / windowSize);
    klineObjs[i].avg.avgTradeDaySellVol = Math.round(sellVolSum / windowSize);
    klineObjs[i].avg.avgTradeDayTrades = Math.round(tradesSum / windowSize);
  }
  return klineObjs;
}
