// deno-lint-ignore-file
import express from "npm:express@4.18.2";
import { ws_main } from "./ws-main.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

import { testReport } from "./functions/test.report.ts";
import { SYNQ } from "./functions/binance/timeframe-control/synq.ts";
import { generateBinanceSignature } from "./functions/utils/generate-binance-signature.ts";
import {
  OpenInterest,
  OpenInterestData,
  OpenInterestHist,
} from "./models/binance/oi.ts";
import { UnixToTime } from "./functions/utils/time-converter.ts";
import { mapOiDataToObj } from "./functions/binance/oi/map-oi-data-to-obj.ts";
const env = await load();

const app = express();

app.get("/", async (req: any, res: any) => {
  try {
    const resp = testReport();

    res.send(resp);
  } catch (e) {
    console.log(e);
  }
});

app.get("/oi", async (req: any, res: any) => {
  try {
    //const data = testReport();
    const data = await collectOiTestData("ETHUSDT");

    res.send(data);
  } catch (e) {
    console.log(e);
  }
});

app.listen(8000, async () => {
  console.log("Server is running...");
});

async function collectOiTestData(symbol: string) {
  const url = new URL(env["BINANCE_OI"]);
  url.searchParams.append("symbol", symbol.toLocaleLowerCase());

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data: OpenInterestData = await response.json();
    const obj = mapOiDataToObj(data);
    return obj;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function collectOiHistTestData(symbol: string) {
  const timeframe: string = SYNQ.loadInitalKlineData.timeframe;
  const limit: string = SYNQ.loadInitalKlineData.numCandles;

  const signature = await generateBinanceSignature(
    symbol,
    env["BINANCE_SECRET_KEY"]
  );
  const url = new URL(env["BINANCE_OI_HIST"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("period", timeframe);
  url.searchParams.append("limit", limit);
  url.searchParams.append("signature", signature);

  const headers = new Headers({
    "X-MBX-APIKEY": env["BINANCE_API_KEY"],
    "Content-Type": "application/json",
  });

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data: OpenInterestHist[] = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

ws_main();
