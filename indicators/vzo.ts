import { calculateEma } from "./ema.ts";

export function calculateVZO(
  prices: number[],
  volumes: number[],
  emaLength = 10
) {
  const dVol = [];
  for (let i = 1; i < prices.length; i++) {
    dVol.push(Math.sign(prices[i] - prices[i - 1]) * volumes[i]); // Handle negative or zero volume
  }

  const emaDVol = calculateEma(dVol, emaLength);

  let _vol = volumes.slice(1);
  const emaVolume = calculateEma(_vol, emaLength);

  // Calculate VZO value with zero volume handling
  const vzo = [];
  for (let i = 0; i < _vol.length; i++) {
    vzo.push(emaVolume[i] != 0 ? (100 * emaDVol[i]) / emaVolume[i] : 0);
  }

  return vzo;
}
