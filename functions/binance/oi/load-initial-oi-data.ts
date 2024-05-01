import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { generateBinanceSignature } from "../../utils/generate-binance-signature.ts";
import { OpenInterestHist } from "../../../models/binance/oi.ts";
import { UnixToTime } from "../../utils/time-converter.ts";

import { SYNQ } from "../timeframe-control/synq.ts";
import { insertOiDataIntoRepo } from "./insert-oi-data-into-repo.ts";

const env = await load();

export async function loadInitialOiData(symbol: string) {
  const timeframe: string = SYNQ.loadInitialOiHistData.timeframe;
  const numCandles: string = SYNQ.loadInitialOiHistData.numCandles;

  const signature = await generateBinanceSignature(
    symbol,
    env["BINANCE_SECRET_KEY"]
  );
  const url = new URL(env["BINANCE_OI_HIST"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("period", timeframe);
  url.searchParams.append("limit", numCandles);
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
    insertOiDataIntoRepo(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
