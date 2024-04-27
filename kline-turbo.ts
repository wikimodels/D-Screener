import { BinanceKlineObj } from "./models/binance/kline.ts";
// deno-lint-ignore-file no-explicit-any
import { BinanceRawKlineObj } from "./models/binance/kline.ts";
const env = await load();
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";

import * as _ from "https://cdn.skypack.dev/lodash";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { getBinanceCoins } from "./collect-liquidation-data.ts";
import { fetchBinanceSpotKlineData } from "./functions/binance/collect-kline-data2.ts";
const kv = await Deno.openKv();

export async function collectKlineData() {
  const coins: any[] = await getBinanceCoins();
  const klineData = await fetchBinanceSpotKlineData("ETHUSDT", "1m", 1);
  console.log("KLINE data Length", klineData[0]);
  await kv.set(["KLINE", "ETHUSDT", "1m"], klineData);
  //SET LIQUIDATION KVDB

  const ws: WebSocketClient = new StandardWebSocketClient(
    env["BINANCE_SPOT_WS"] + "ethusdt@kline_1m"
  );
  ws.on("open", function () {
    console.log("----- WS CONNECTED -----");
  });
  ws.on("message", async function (message: any) {
    const data: BinanceRawKlineObj = JSON.parse(message.data);
    if (data.k.x == true) {
      const binanceKlineObj = mapWsToKlineObj(data);
      const kline = await getBinanceKlineKvData(["KLINE", "ETHUSDT", "1m"]);
      console.log(kline[0]);
      //   let klineData: any = (await kv.get(["KLINE", "ETHUSDT", "1m"])).value;
      //   klineData.splice(0, 1);
      //   klineData.push(binanceKlineObj);
      //   await kv.set(["KLINE", "ETHUSDT", "1m"], klineData);
    }
  });

  ws.on("error", function (error: Error) {
    console.log("ERROR MESSAGE", error.message);
    console.log(error.cause);
    console.log(error.stack);
  });
  ws.on("close", function () {
    console.log("THIS shithole is closed");
  });
}
collectKlineData();

export function mapWsToKlineObj(rawObj: BinanceRawKlineObj): BinanceKlineObj {
  const obj: BinanceKlineObj = {
    openTime: Number(rawObj.k.t),
    open: Number(rawObj.k.o),
    high: Number(rawObj.k.h),
    low: Number(rawObj.k.l),
    close: Number(rawObj.k.c),
    baseVolume: Number(rawObj.k.v),
    closeTime: Number(rawObj.k.T),
    quoteVolume: Number(rawObj.k.q),
    numberOfTrades: Number(rawObj.k.n),
    isCandleClosed: rawObj.k.x,
    takerBuyBaseVolume: Number(rawObj.k.V),
    takerBuyQuoteVolume: Number(rawObj.k.Q),
    takerSellBaseVolume: Number(rawObj.k.v) - Number(rawObj.k.V),
    takerSellQuoteVolume: Number(rawObj.k.q) - Number(rawObj.k.Q),
    hlc3: (Number(rawObj.k.o) + Number(rawObj.k.l) + Number(rawObj.k.c)) / 3,
  };
  return obj;
}

// Function to get data from KV database (assuming KV API)
export async function getBinanceKlineKvData(
  key: string[]
): Promise<BinanceKlineObj[]> {
  const value = (await kv.get(key)).value;
  if (!value) {
    throw new Error(`Kline data not found for key: ${key}`);
  }
  return value as BinanceKlineObj[];
}
