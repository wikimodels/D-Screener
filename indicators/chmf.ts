import { SYNQ } from "../functions/shared/timeframe-control/synq.ts";
import { KlineObj } from "../models/shared/kline.ts";
import { calculateEma } from "./ema.ts";

interface BasicData {
  symbol: string;
  openTime: number;
  closeTime: number;
  high: number;
  close: number;
  open: number;
  low: number;
  volume: number;
  ch_am_ads: number;
  ch_mf_value: number;
  ch_mf_ema: number;
}

export function calculateChMf(klineObjs: KlineObj[]) {
  const chMfLen = SYNQ.calculateCMF.chMfLen;
  const chMfEmaLen = SYNQ.calculateCMF.chMfEmaLen;

  //YOU NEED BASE VOLUME!!!
  const data: BasicData[] = klineObjs.map((o) => {
    return {
      symbol: o.symbol,
      openTime: o.openTime,
      closeTime: o.closeTime,
      high: o.high,
      close: o.close,
      low: o.low,
      open: o.open,
      volume: o.baseVolume,
      ch_am_ads: 0,
      ch_mf_value: 0,
      ch_mf_ema: 0,
    };
  });

  data.forEach((d) => {
    if ((d.close == d.high && d.close == d.low) || d.high == d.low) {
      d.ch_am_ads = 0;
    } else {
      d.ch_am_ads =
        ((2 * d.close - d.low - d.high) / (d.high - d.low)) * d.volume;
    }
  });

  data.forEach((d, i) => {
    if (i > chMfLen - 1) {
      const ch_mf_sum = data
        .slice(i - chMfLen, i)
        .map((e) => e.ch_am_ads)
        .reduce((acc: number, cur: number) => {
          acc = acc + cur;
          return acc;
        }, 0);

      const ch_mf_vol = data
        .slice(i - chMfLen, i)
        .map((e) => e.volume)
        .reduce((acc: number, cur: number) => {
          acc = acc + cur;
          return acc;
        }, 0);

      data[i - 1].ch_mf_value = ch_mf_sum / ch_mf_vol;
    }
  });

  const chMfValues = data.map((v) => v.ch_mf_value);
  const emas = calculateEma(chMfValues, chMfEmaLen);
  emas.forEach((c, i) => {
    data[i].ch_mf_ema = c;
  });

  klineObjs.forEach((o) => {
    data.forEach((d) => {
      if (o.openTime == d.openTime && o.closeTime == d.closeTime) {
        o.chMf.chMfValue = d.ch_mf_value;
        o.chMf.chMfEma = d.ch_mf_ema;
      }
    });
  });
  return klineObjs;
}
