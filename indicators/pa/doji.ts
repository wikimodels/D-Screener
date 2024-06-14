import { KlineObj } from "../../models/shared/kline.ts";
import { TF } from "../../models/shared/timeframes.ts";

export function checkDojis(klineObjs: KlineObj[]) {
  klineObjs.forEach((o) => {
    o.isDoji = isDoji(o.open, o.close, o.high, o.low);
  });
  return klineObjs;
}

export function check2hDojis(klineObjs: KlineObj[], timeframe: TF) {
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
        klineObjs[i].is2hDoji = isDoji(
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

function isDoji(open: number, close: number, high: number, low: number) {
  const doji_precision = 0.15;
  const isDoji =
    Math.abs(open - close) <= (high - low) * doji_precision ? true : false;
  return isDoji;
}
