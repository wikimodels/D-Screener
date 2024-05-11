import { KlineObj } from "../models/shared/kline.ts";

export function calculateCvd(klineObjs: KlineObj[]): KlineObj[] {
  let previousCVD = 0;

  for (let i = 0; i < klineObjs.length; i++) {
    const netVolume =
      klineObjs[i].takerBuyBaseVolume - klineObjs[i].takerSellBaseVolume;
    const cvd = klineObjs.length == 0 ? netVolume : previousCVD + netVolume;
    klineObjs[i].cvd = cvd;
    previousCVD = cvd;
  }

  return klineObjs;
}
