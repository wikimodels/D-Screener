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

export async function testReport() {
  let shit: CandlesRepo[] = await createCandlesRepo("1h");
  let result = calculateAtdvAtdt(shit[0].data, "1h");
  let res = [];
  result.forEach((r) => {
    res.push({
      openTime: UnixToTime(r.openTime),
      avgTradeDayVol: r.avgTradeDayVol,
      avgTradeDayBuyVol: r.avgTradeDayBuyVol,
      avgTradeDaySellVol: r.avgTradeDaySellVol,
      avgTradeDayTrades: r.avgTradeDayTrades,
    });
  });
  return res;
}
