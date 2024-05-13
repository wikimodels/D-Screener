// deno-lint-ignore-file no-explicit-any
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

import { QueueMsg } from "../../../models/queue-task.ts";
import { enqueue } from "../../kv-utils/kv-enqueue.ts";
import { mapFundingRateDataToObj } from "./map-mark-update-data-to-obj.ts";
import { FundingRate } from "../../../models/binance/funding-rate.ts";
import { KvOps } from "../../kv-utils/kv-ops.ts";
import { UnixToTime } from "../../utils/time-converter.ts";

const env = await load();

export async function collectFrData(
  symbol: string,
  closeTime: number,
  timeframe: string
) {
  const url = new URL(env["BYBIT_FR"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("category", "linear");
  url.searchParams.append("limit", "1");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data: any = await response.json();
    const res = data.result.list[0];

    const obj: FundingRate = mapFundingRateDataToObj(res, closeTime);

    const msg: QueueMsg = {
      data: {
        closeTime: closeTime,
        dataObj: obj as FundingRate,
      },
      queueName: KvOps.saveFrObjToKv,
      timeframe: timeframe,
    };

    await enqueue(msg);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
