import { express } from "npm:express@4.18.2";
// deno-lint-ignore-file no-explicit-any no-explicit-any
const env = await load();
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";

import * as _ from "https://cdn.skypack.dev/lodash";
import { datetime } from "https://deno.land/x/ptera/mod.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

import loadCSV from "./functions/utils/csv/load-csv.ts";
import { getBinanceCoins } from "./collect-liquidation-data.ts";
import {
  UnixToISO,
  UnixToNamedTimeRu,
  UnixToTime,
} from "./functions/utils/time-converter.ts";

// const kv = await Deno.openKv();

export async function collectFundingRate() {
  const binanceCoins = await getBinanceCoins();
  const response = await fetch(
    "https://fapi.binance.com/fapi/v1/fundingRate?symbol=XRPUSDT&limit=10"
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  const frCoins = await response.json();
  frCoins.forEach((f: any) => {
    console.log(UnixToTime(f.fundingTime));
  });
  console.log("BINANCE COINS", binanceCoins.length);
  console.log(frCoins);
  console.log(datetime(frCoins[0].fundingTime).format("YYYY-MM-dd HH:mm:ss"));
  console.log(UnixToISO(frCoins[0].fundingTime));
  console.log(UnixToTime(frCoins[0].fundingTime));
  console.log(UnixToNamedTimeRu(frCoins[0].fundingTime));
}
collectFundingRate();
