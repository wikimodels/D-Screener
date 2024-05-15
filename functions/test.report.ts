import { DateTime } from "https://deno.land/x/ptera@v1.0.2/mod.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { createCandlesRepo } from "./shared/candles-repo/create-candles-repo.ts";
import * as _ from "https://cdn.skypack.dev/lodash";
import { UnixToTime } from "./utils/time-converter.ts";
import { calculateChMf } from "../indicators/chmf.ts";
import { KlineObj } from "../models/shared/kline.ts";

import {
  calculateDailyVwap,
  calculateWeeklyVWAP,
  isStartOfMonday,
  splitByWeeks,
} from "../indicators/vwap.ts";
import { CandlesRepo } from "../models/binance/candles-repo.ts";
import { calculateCvd } from "../indicators/cvd.ts";
import { calculateAtdvAtdt } from "../indicators/atdv-atdt.ts";
import { calculateRatios } from "../indicators/ratios.ts";
import { TF } from "../models/shared/timeframes.ts";
const timeframe: string = TF.h1;
export async function testReport() {
  let shit: CandlesRepo[] = await createCandlesRepo(timeframe);
  let result = calculateRatios(shit[0].data, timeframe);
  let res: any[] = [];
  result.forEach((r) => {
    res.push({
      openTime: UnixToTime(r.openTime),
      volRatio2hto24h: r.ratios.volBuyRatio2hTo24h,
      volBuyRatio2hto24h: r.ratios.volBuyRatio2hTo24h,
      volSellRatio2hto24h: r.ratios.volSellRatio2hTo24h,
      liq24hRatio: r.ratios.liq24hRatio,
    });
  });
  return res;
}
