import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { createCandlesRepo } from "./binance/candles-repo/create-candles-repo.ts";
import * as _ from "https://cdn.skypack.dev/lodash";
import { UnixToTime } from "./utils/time-converter.ts";
import { calculateChMf } from "../indicators/chmf.ts";
import { KlineObj } from "../models/binance/kline.ts";

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

export async function testReport() {
  let shit: CandlesRepo[] = await createCandlesRepo("1h");
  let result = calculateRatios(shit[0].data, "1h");
  let res = [];
  result.forEach((r) => {
    res.push({
      openTime: UnixToTime(r.openTime),
      volRatio2hto24h: r.volRatio2hto24h,
      volBuyRatio2hto24h: r.volBuyRatio2hto24h,
      volSellRatio2hto24h: r.volSellRatio2hto24h,
      liq24hRatio: r.liq24hRatio,
    });
  });
  return res;
}
