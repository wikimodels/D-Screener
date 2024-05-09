import { KlineObj } from "../models/binance/kline.ts";

export function calculateRatios(klineObjs: KlineObj[], timeframe: string) {
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
      volSum += klineObjs[j].baseVolume;
      buyVolSum += klineObjs[j].takerBuyBaseVolume;
      sellVolSum += klineObjs[j].takerSellBaseVolume;
      tradesSum += klineObjs[j].numberOfTrades;
    }
    klineObjs[i].ratios.volRatio2hTo24h =
      ((klineObjs[i].baseVolume + klineObjs[i - 1].baseVolume) / volSum) * 100;
    klineObjs[i].ratios.volBuyRatio2hTo24h =
      ((klineObjs[i].takerBuyBaseVolume + klineObjs[i - 1].takerBuyBaseVolume) /
        buyVolSum) *
      100;
    klineObjs[i].ratios.volSellRatio2hTo24h =
      ((klineObjs[i].takerSellBaseVolume +
        klineObjs[i - 1].takerSellBaseVolume) /
        sellVolSum) *
      100;
    klineObjs[i].ratios.tradesRatioTo24h =
      (klineObjs[i].numberOfTrades / tradesSum) * 100;

    if (klineObjs[i].liquidations.buy.liqSum > 0) {
      klineObjs[i].ratios.liq24hRatio =
        klineObjs[i].liquidations.buy.liqSum / volSum;
    }
    if (klineObjs[i].liquidations.sell.liqSum > 0) {
      klineObjs[i].ratios.liq24hRatio =
        klineObjs[i].liquidations.sell.liqSum / volSum;
    }
  }
  return klineObjs;
}
