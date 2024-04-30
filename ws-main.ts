// deno-lint-ignore-file no-explicit-any no-explicit-any

import * as _ from "https://cdn.skypack.dev/lodash";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

import { collectKlineData } from "./functions/binance/kline/collect-kline-data.ts";
import { collectMarkPriceData } from "./functions/binance/mark-price-update/collect-mark-price-update-data.ts";
import { collectForeOrderData } from "./functions/binance/force-order/collect-force-order-data.ts";
import { getAllCoins } from "./functions/utils/get-coins.ts";

import { calculateStartTime } from "./functions/utils/calculate-start-time.ts";
import { mapKlineHttpDataToObj } from "./functions/binance/kline/map-kline-http-data-to-obj copy.ts";
import { KlineObj } from "./models/binance/kline.ts";
import { UnixToTime } from "./functions/utils/time-converter.ts";
import { candlesRepo } from "./functions/binance/candles-repo/create-candles-repo.ts";
const env = await load();

async function ws_main() {
  const coins = await getAllCoins();
  for await (const c of coins) {
    await loadInitalKlineData(c.symbol, "1m", 2, 1);
  }
  candlesRepo.forEach((c) => {
    c.data.forEach((d) => {
      // console.log("symbol", d.symbol);
      // console.log("openTime", UnixToTime(d.openTime));
      console.log(d);
      console.log("----------------------------------");
    });
  });
  coins.forEach((c) => {
    collectForeOrderData(c.symbol);
    collectKlineData(c.symbol, "1m");
    collectMarkPriceData(c.symbol);
  });
}
ws_main();

async function loadInitalKlineData(
  symbol: string,
  timeframe: string,
  numCandles: number,
  candleIntervalInMin: number
) {
  const url = new URL(env["BINANCE_SPOT_KLINE"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("interval", timeframe);
  url.searchParams.append(
    "startTime",
    calculateStartTime(numCandles, candleIntervalInMin).toString()
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
