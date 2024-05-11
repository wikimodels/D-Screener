// deno-lint-ignore-file no-explicit-any
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { SYNQ } from "../../shared/timeframe-control/synq.ts";
import { calculateStartTime } from "../../utils/calculate-start-time.ts";

import { UnixToISO, UnixToTime } from "../../utils/time-converter.ts";
import { getCandleInterval } from "../../utils/get-candle-interval.ts";

import { mapResponseToOiData } from "./map-response-to-oi-data.ts";
import { OpenInterestHist } from "../../../models/shared/oi.ts";

const env = await load();

export async function loadInitialOiData(symbol: string, timeframe: string) {
  const numCandles: string = SYNQ.loadInitalKlineData.numCandles;
  const candleIntervalInMin: number = getCandleInterval(timeframe);
  timeframe = timeframe.replace(/m/g, "min");
  const url = new URL(env["BYBIT_OI"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append(
    "startTime",
    calculateStartTime(Number(numCandles), candleIntervalInMin).toString()
  );
  url.searchParams.append("endTime", new Date().getTime().toString());
  url.searchParams.append("category", "linear");
  url.searchParams.append("intervalTime", timeframe);
  url.searchParams.append("limit", "200");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    let data: any = await response.json();
    let res = data.result.list;

    while (data.result.nextPageCursor) {
      url.searchParams.set("cursor", data.result.nextPageCursor);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      data = await response.json();
      const nextRes: any[] = data.result.list;
      res = [...res, ...nextRes];
    }
    const oiHistData: OpenInterestHist[] = mapResponseToOiData(res, symbol);
    return oiHistData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
