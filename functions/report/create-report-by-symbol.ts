import { keysIn } from "https://cdn.skypack.dev/lodash";
import { calculateAtdvAtdt } from "../../indicators/atdv-atdt.ts";
import { calculateChanges } from "../../indicators/changes.ts";
import { calculateChMf } from "../../indicators/chmf.ts";
import { calculateCvd } from "../../indicators/cvd.ts";
import { calculateRatios } from "../../indicators/ratios.ts";
import { calculateVO } from "../../indicators/vo.ts";
import {
  calculateDailyVwap,
  calculateWeeklyVwap,
} from "../../indicators/vwap.ts";
import { calculateVZO } from "../../indicators/vzo.ts";
import { CandlesRepo } from "../../models/binance/candles-repo.ts";
import { getKlineBySymbol } from "./get-kline-by-symbol.ts";
import { writeFrToKline } from "./write-fr-to-knile.ts";
import { writeLiqToKline } from "./write-liq-to-kline.ts";
import { writeOiToKline } from "./write-oi-to-kline.ts";
import { writePublicTradesToKline } from "./write-public-trades-to-kline.ts";

export async function createReportBySymbol(timeframe: string, symbol: string) {
  const repo: CandlesRepo = {
    symbol: symbol,
    tf: timeframe,
    data: [],
  };
  let kline = await getKlineBySymbol(timeframe, symbol);

  kline = await writeFrToKline(timeframe, symbol, kline);
  kline = await writeLiqToKline(timeframe, symbol, kline);
  kline = await writeOiToKline(timeframe, symbol, kline);
  kline = await writePublicTradesToKline(timeframe, symbol, kline);
  kline = calculateAtdvAtdt(timeframe, kline);
  kline = calculateChMf(kline);
  kline = calculateCvd(kline);
  kline = calculateVO(kline);
  kline = calculateVZO(kline);
  kline = calculateChanges(kline);
  kline = calculateRatios(timeframe, kline);
  kline = calculateDailyVwap(kline);
  kline = calculateWeeklyVwap(kline);

  repo.data = [...kline];
  return repo;
}
