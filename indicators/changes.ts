import { KlineObj } from "../models/shared/kline.ts";

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
    klineObjs[i].changes.avgTradeDayBuyVolChg = getPercentageDif(
      klineObjs[i - 1].avg.avgTradeDayBuyVol -
        klineObjs[i].avg.avgTradeDayBuyVol
    );
    klineObjs[i].changes.avgTradeDaySellVolChg = getPercentageDif(
      klineObjs[i - 1].avg.avgTradeDaySellVol -
        klineObjs[i].avg.avgTradeDaySellVol
    );
    klineObjs[i].changes.avgTradeDayTradesChg = getPercentageDif(
      klineObjs[i - 1].avg.avgTradeDayTrades -
        klineObjs[i].avg.avgTradeDayTrades
    );
    klineObjs[i].changes.avgTradeDayVolChg = getPercentageDif(
      klineObjs[i - 1].avg.avgTradeDayVol - klineObjs[i].avg.avgTradeDayVol
    );
  }
}

function getPercentageDif(value: number, baseline: number = 100): number {
  if (baseline == 0) {
    return 0;
  }
  return ((value - baseline) / baseline) * 100;
}
