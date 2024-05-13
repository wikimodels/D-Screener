import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { generateBinanceSignature } from "../../utils/generate-binance-signature.ts";
import { OpenInterest, OpenInterestHist } from "../../../models/shared/oi.ts";
import { UnixToTime } from "../../utils/time-converter.ts";
import { SYNQ } from "../../shared/timeframe-control/synq.ts";
import { QueueMsg } from "../../../models/queue-task.ts";
import { mapOiHistDataToOiObjs } from "../../shared/map-oi-hist-data-to-oi-objs.ts";
import { enqueue } from "../../kv-utils/kv-enqueue.ts";
import { KvOps } from "../../kv-utils/kv-ops.ts";

const env = await load();

export async function loadInitialOiData(symbol: string, timeframe: string) {
  timeframe = timeframe == "1m" ? "5m" : timeframe;
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
    const objs: OpenInterest[] = mapOiHistDataToOiObjs(data);

    objs.forEach(async (d) => {
      const msg: QueueMsg = {
        timeframe: timeframe,
        queueName: KvOps.saveOiObjToKv,
        data: {
          dataObj: d as OpenInterest,
          closeTime: d.closeTime,
        },
      };
      await enqueue(msg);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
