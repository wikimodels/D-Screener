// deno-lint-ignore-file no-explicit-any
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { KlineObj } from "../../../models/shared/kline.ts";
import { calculateStartTime } from "../../utils/calculate-start-time.ts";
import { SYNQ } from "../../shared/timeframe-control/synq.ts";
import { mapKlineHttpDataToObj } from "./map-kline-http-data-to-obj%20copy.ts";
import { getCandleInterval } from "../../utils/get-candle-interval.ts";
import { QueueMsg } from "../../../models/queue-task.ts";
import { enqueue } from "../../kv-utils/kv-enqueue.ts";
import { KvOps } from "../../kv-utils/kv-ops.ts";

const env = await load();

export async function loadInitalKlineData(symbol: string, timeframe: string) {
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
    if (klineObjs.length < Number(SYNQ.loadInitalKlineData.numCandles)) {
      console.error(
        `${symbol} --> NOT ALL DATA LOADED! Needed: ${SYNQ.loadInitalKlineData.numCandles}. Got ${klineObjs.length}`
      );
    }

    klineObjs.forEach(async (obj) => {
      const msg: QueueMsg = {
        timeframe: timeframe,
        queueName: KvOps.saveKlineObjToKv,
        data: {
          dataObj: obj,
          closeTime: obj.closeTime,
        },
      };
      await enqueue(msg);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
