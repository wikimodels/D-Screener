import { KlineObj } from "../../models/shared/kline.ts";
import { TF } from "../../models/shared/timeframes.ts";

export function checkHammers(klineObjs: KlineObj[]) {
  klineObjs.forEach((o) => {
    o.isHammer = isHammer(o.open, o.close, o.high, o.low);
  });
  return klineObjs;
}

export function check2hHammers(klineObjs: KlineObj[], timeframe: TF) {
  if (timeframe == TF.h1) {
    for (let i = 0; i < klineObjs.length; i++) {
      if (i > 2 && new Date(klineObjs[i].openTime).getHours() % 2 == 0) {
        const highestHigh =
          klineObjs[i].high >= klineObjs[i - 1].high
            ? klineObjs[i].high
            : klineObjs[i - 1].high;
        const lowestLow =
          klineObjs[i].low < klineObjs[i - 1].low
            ? klineObjs[i].low
            : klineObjs[i - 1].low;
        klineObjs[i].is2hHammer = isHammer(
          klineObjs[i - 1].open,
          klineObjs[i].close,
          highestHigh,
          lowestLow
        );
      }
    }
  }
  return klineObjs;
}

function isHammer(open: number, close: number, high: number, low: number) {
  const hammer_ratio = 0.5;
  const true_hammer = high - hammer_ratio * (high - low);
  const bearish_hammer = close < open && close >= true_hammer;
  const bullish_hammer = close > open && open >= true_hammer;
  return bearish_hammer || bullish_hammer;
}
