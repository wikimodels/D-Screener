// deno-lint-ignore-file no-explicit-any
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

import { OpenInterest } from "../../../models/shared/oi.ts";
import { mapResponseToOiObj } from "./map-response-to-oi-obj.ts";
import { QueueMsg } from "../../../models/queue-task.ts";
import { enqueue } from "../../kv-utils/kv-enqueue.ts";

const env = await load();

export async function collectOiData(
  symbol: string,
  closeTime: number,
  timeframe: string
) {
  timeframe = timeframe.replace(/m/g, "min");
  const url = new URL(env["BYBIT_OI"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("intervalTime", timeframe);
  url.searchParams.append("limit", "1");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: any = await response.json();
    const res = data.result.list[0];

    const oiObj: OpenInterest = mapResponseToOiObj(res, closeTime, symbol);
    const msg: QueueMsg = {
      timeframe: timeframe,
      queueName: "insertOiRecord",
      data: {
        dataObj: oiObj as OpenInterest,
        closeTime: closeTime,
      },
    };
    await enqueue(msg);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
