import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import {
  candlesRepo,
  createCandlesRepo,
} from "./binance/candles-repo/create-candles-repo.ts";
import * as _ from "https://cdn.skypack.dev/lodash";
import { UnixToTime } from "./utils/time-converter.ts";
import { calculateChMf } from "../indicators/chmf.ts";
import { KlineObj } from "../models/binance/kline.ts";
import { getAllFundingRates } from "./binance/mark-price-update/get-fr-by-symbol.ts";
import { getAllOpenInterest } from "./binance/oi/get-oi-by-symbol.ts";
import {
  getAllKline,
  getKlineBySymbol,
} from "./binance/kline/get-kline-by-symbol.ts";
import { calculateVO } from "../indicators/vo.ts";
import { assembleKline } from "./binance/kline/assemble-kline.ts";

export async function testReport() {
  let shit = createCandlesRepo("1h");
  return shit;
}
