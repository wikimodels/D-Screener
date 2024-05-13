// deno-lint-ignore-file no-explicit-any
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

import { OpenInterest } from "../../../models/shared/oi.ts";
import { mapResponseToOiObj } from "./map-response-to-oi-obj.ts";
import { QueueMsg } from "../../../models/queue-task.ts";
import { enqueue } from "../../kv-utils/kv-enqueue.ts";
import { UnixToTime } from "../../utils/time-converter.ts";
import { KvOps } from "../../kv-utils/kv-ops.ts";

const env = await load();

export async function collectOiData(
  symbol: string,
  closeTime: number,
  timeframe: string
) {
  //BYBIT DOESN'T HAVE OI TIMEFRAME == 1M
  //THAT'S WHY IT HAS TO BE CHECKED
  timeframe = timeframe.replace(/m/g, "min");
  timeframe = timeframe == "1min" ? "5min" : timeframe;

  const url = new URL(env["BYBIT_OI"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("intervalTime", timeframe);
  url.searchParams.append("limit", "1");
  url.searchParams.append("category", "linear");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: any = await response.json();
    const res = data.result.list[0];
    console.log("OI data arrived", UnixToTime(new Date().getTime()));

    const obj: OpenInterest = mapResponseToOiObj(res, symbol);

    const msg: QueueMsg = {
      timeframe: timeframe.replace(/min/g, "m"),
      queueName: KvOps.saveOiObjToKv,
      data: {
        dataObj: obj as OpenInterest,
        closeTime: obj.timestamp,
      },
    };
    await enqueue(msg);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
