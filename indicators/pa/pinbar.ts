import { KlineObj } from "../../models/shared/kline.ts";
import { TF } from "../../models/shared/timeframes.ts";

export function checkPinbars(klineObjs: KlineObj[]) {
  klineObjs.forEach((o) => {
    o.isPinbar = isPinbar(o.open, o.close, o.high, o.low);
  });
  return klineObjs;
}

export function check2hPinbars(klineObjs: KlineObj[], timeframe: TF) {
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
        klineObjs[i].is2hPinbar = isPinbar(
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

function isPinbar(open: number, close: number, high: number, low: number) {
  const pinbar_ratio = 0.5;
  const true_pinbar = pinbar_ratio * (high - low) + low;
  const bearish_pinbar = close < open && open <= true_pinbar;
  const bullish_pinbar = close > open && close <= true_pinbar;
  return bearish_pinbar || bullish_pinbar;
}
