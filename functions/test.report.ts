import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { candlesRepo } from "./binance/candles-repo/create-candles-repo.ts";
import * as _ from "https://cdn.skypack.dev/lodash";
import { UnixToTime } from "./utils/time-converter.ts";
import { calculateChMf } from "../indicators/chmf.ts";
import { KlineObj } from "../models/binance/kline.ts";
import { getAllFundingRates } from "./binance/mark-price-update/get-all-fr.ts";
import { getAllOpenInterest } from "./binance/oi/get-all-oi.ts";
import { getAllKline } from "./binance/kline/get-all-kline.ts";

export async function testReport() {
  const shit = await getAllKline("15m");
  const fuck: any[] = [];
  shit.forEach((s) => {
    const _b = {
      o: s.open,
      c: s.close,
      h: s.high,
      l: s.low,
      closeTime: UnixToTime(s.closeTime),
    };
    fuck.push(_b);
  });

  return fuck;
}
