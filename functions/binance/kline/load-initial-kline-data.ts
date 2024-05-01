// deno-lint-ignore-file no-explicit-any
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { KlineObj } from "../../../models/binance/kline.ts";
import { calculateStartTime } from "../../utils/calculate-start-time.ts";
import { candlesRepo } from "../candles-repo/create-candles-repo.ts";
import { SYNQ } from "../timeframe-control/synq.ts";
import { mapKlineHttpDataToObj } from "./map-kline-http-data-to-obj%20copy.ts";
import { getCandleInterval } from "./get-candle-interval.ts";

const env = await load();

export async function loadInitalKlineData(symbol: string) {
  const timeframe: string = SYNQ.loadInitalKlineData.timeframe;
  const numCandles: string = SYNQ.loadInitalKlineData.numCandles;
  const candleIntervalInMin: number = getCandleInterval(timeframe);

  const url = new URL(env["BINANCE_SPOT_KLINE"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("interval", timeframe);
  url.searchParams.append(
    "startTime",
    calculateStartTime(Number(numCandles), candleIntervalInMin).toString()
  );
  url.searchParams.append("endTime", new Date().getTime().toString());

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data: any[] = await response.json();
    const klineObjs: KlineObj[] = data.reduce((acc, cur) => {
      const obj = mapKlineHttpDataToObj(cur, symbol);
      acc.push(obj);
      return acc;
    }, []);

    candlesRepo.forEach((r) => {
      if (r.symbol == symbol) {
        r.data = [...klineObjs];
      }
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
