import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { OpenInterest, OpenInterestData } from "../../../models/shared/oi.ts";
import { UnixToTime } from "../../utils/time-converter.ts";
import { mapOiDataToObj } from "./map-oi-data-to-obj.ts";
import { enqueue } from "../../kv-utils/kv-enqueue.ts";
import { QueueMsg } from "../../../models/queue-task.ts";

const env = await load();

export async function collectOiData(
  symbol: string,
  closeTime: number,
  timeframe: string
) {
  const url = new URL(env["BINANCE_OI"]);
  url.searchParams.append("symbol", symbol.toLocaleLowerCase());

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data: OpenInterestData = await response.json();
    const obj = mapOiDataToObj(data, closeTime);

    const msg: QueueMsg = {
      timeframe: timeframe,
      queueName: "insertOiRecord",
      data: {
        dataObj: obj as OpenInterest,
        closeTime: closeTime,
      },
    };
    await enqueue(msg);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
