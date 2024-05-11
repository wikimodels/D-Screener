import { KlineObj } from "../models/shared/kline.ts";
import { calculateEma } from "./ema.ts";

export function calculateVO(klineObjs: KlineObj[]) {
  //For VO you need QuoteVolume. Checked.
  const sellValues = klineObjs.map((v) => v.takerSellQuoteVolume);
  const buyValues = klineObjs.map((v) => v.takerBuyQuoteVolume);
  const sellOsc = volumeOscillator(sellValues);
  const buyOsc = volumeOscillator(buyValues);

  klineObjs.forEach((o, i) => {
    o.vo.buyValue = buyOsc[i];
    o.vo.sellValue = sellOsc[i];
  });
  return klineObjs;
}

function volumeOscillator(values: number[]) {
  const shortEma = calculateEma(values, 5);
  const longEma = calculateEma(values, 10);

  const osc: number[] = [];
  values.forEach((v, i) => {
    const val = (100 * (shortEma[i] - longEma[i])) / longEma[i];
    osc.push(val);
  });

  return osc;
}
