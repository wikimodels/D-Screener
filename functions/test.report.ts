import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { candlesRepo } from "./binance/candles-repo/create-candles-repo.ts";
import * as _ from "https://cdn.skypack.dev/lodash";
import { UnixToTime } from "./utils/time-converter.ts";
import { calculateChMf } from "../indicators/chmf.ts";
import { KlineObj } from "../models/binance/kline.ts";
import { getAllFundingRates } from "./binance/mark-price-update/get-all-fr.ts";
import { getAllOpenInterest } from "./binance/oi/get-all-oi.ts";
import { getAllKline } from "./binance/kline/get-all-kline.ts";
import { calculateVO } from "../indicators/vo.ts";
import { assembleKline } from "./binance/kline/assemble-kline.ts";
import { calculateVZO } from "../indicators/vzo.ts";

export async function testReport() {
  let shit = await assembleKline("1m");
  shit = calculateChMf(shit);
  shit = calculateVO(shit);
  shit = calculateVZO(shit);
  let fuck: any[] = [];
  shit.forEach((v) => {
    fuck.push({
      symbol: v.symbol,
      closeTime: UnixToTime(v.closeTime),
      vzo: v.vzo,
    });
  });
  fuck = _.groupBy(fuck, "symbol");
  return fuck;
}
