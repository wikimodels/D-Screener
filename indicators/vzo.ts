import { KlineObj } from "../models/shared/kline.ts";
import { calculateEma } from "./ema.ts";

export function calculateVZO(klineObjs: KlineObj[]) {
  const prices = klineObjs.map((o) => o.close);
  const volumes = klineObjs.map((o) => o.baseVolume);
  const vzo = getVzo(prices, volumes, 10);
  klineObjs.forEach((o, i) => {
    if (i > 1) {
      o.vzo = vzo[i];
    }
  });
  return klineObjs;
}

function getVzo(prices: number[], volumes: number[], emaLength = 10) {
  const dVol = [];
  for (let i = 1; i < prices.length; i++) {
    dVol.push(Math.sign(prices[i] - prices[i - 1]) * volumes[i]); // Handle negative or zero volume
  }

  const emaDVol = calculateEma(dVol, emaLength);

  const _vol = volumes.slice(1);
  const emaVolume = calculateEma(_vol, emaLength);

  // Calculate VZO value with zero volume handling
  const vzo = [];
  for (let i = 0; i < _vol.length; i++) {
    vzo.push(emaVolume[i] != 0 ? (100 * emaDVol[i]) / emaVolume[i] : 0);
  }

  return vzo;
}
