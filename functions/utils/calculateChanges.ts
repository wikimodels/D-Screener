import { KlineObj } from "../../models/binance/kline.ts";

export function calculateChanges(klineObjs: KlineObj[]) {
  for (let i = 1; i < klineObjs.length; i++) {
    klineObjs[i].changes.priceChg = getPercentageDif(
      klineObjs[i - 1].close - klineObjs[i].close
    );
    klineObjs[i].changes.oiChg = getPercentageDif(
      klineObjs[i - 1].oi.oiValue - klineObjs[i].oi.oiValue
    );
    klineObjs[i].changes.cvdChg = getPercentageDif(
      klineObjs[i - 1].cvd - klineObjs[i].cvd
    );
    klineObjs[i].changes.volumeChg = getPercentageDif(
      klineObjs[i - 1].baseVolume - klineObjs[i].baseVolume
    );
  }
}

function getPercentageDif(value: number, baseline: number = 100): number {
  if (baseline == 0) {
    return 0;
  }
  return ((value - baseline) / baseline) * 100;
}
