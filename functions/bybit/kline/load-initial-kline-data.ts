// deno-lint-ignore-file no-explicit-any
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { KlineObj } from "../../../models/shared/kline.ts";
import { SYNQ } from "../../shared/timeframe-control/synq.ts";
import { mapKlineHttpDataToObj } from "./map-kline-http-data-to-obj%20copy.ts";

const env = await load();

export async function loadInitalKlineData(
  symbol: string,
  timeframeInMin: number
): Promise<KlineObj[]> {
  const url = new URL(env["BYBIT_SPOT_KLINE"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("category", "spot");
  url.searchParams.append("interval", timeframeInMin.toString());
  url.searchParams.append("limit", SYNQ.loadInitalKlineData.numCandles);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: any = await response.json();

    const klineObjs: KlineObj[] = data.result.list.reduce(
      (acc: any, cur: any) => {
        const obj = mapKlineHttpDataToObj(cur, symbol, timeframeInMin);
        acc.push(obj);
        return acc;
      },
      []
    );
    if (klineObjs.length < Number(SYNQ.loadInitalKlineData.numCandles)) {
      console.error(
        `${symbol} --> NOT ALL DATA LOADED! Needed: ${SYNQ.loadInitalKlineData.numCandles}. Got ${klineObjs.length}`
      );
    }
    return klineObjs;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
