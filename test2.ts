import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { mapResponseToOiData } from "./functions/bybit/oi/map-response-to-oi-data.ts";
import { enqueue } from "./functions/kv-utils/kv-enqueue.ts";
import { mapOiHistDataToOiObjs } from "./functions/shared/map-oi-hist-data-to-oi-objs.ts";
import { SYNQ } from "./functions/shared/timeframe-control/synq.ts";
import { calculateStartTime } from "./functions/utils/calculate-start-time.ts";
import { getCandleInterval } from "./functions/utils/get-candle-interval.ts";
import { QueueMsg } from "./models/queue-task.ts";
import { OpenInterestHist, OpenInterest } from "./models/shared/oi.ts";
import { UnixToTime } from "./functions/utils/time-converter.ts";

const env = await load();

export async function getOi(symbol: string, timeframe: string) {
  //BYBIT DOESN'T HAVE OI TIMEFRAME == 1M
  //THAT'S WHY IT HAS TO BE CHECKED
  timeframe = timeframe.replace(/m/g, "min");
  timeframe = timeframe == "1min" ? "5min" : timeframe;

  const url = new URL(env["BYBIT_OI"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("category", "linear");
  url.searchParams.append("limit", "1");
  url.searchParams.append("intervalTime", timeframe);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    let data: any = await response.json();

    let res = data.result.list;

    console.log(res);
    const oiHistData: OpenInterestHist[] = mapResponseToOiData(res, symbol);

    const objs: OpenInterest[] = mapOiHistDataToOiObjs(oiHistData);
    objs.forEach((o) => {
      console.log(
        o.symbol,
        "timestamp",
        UnixToTime(o.timestamp),
        "cur. time",
        UnixToTime(new Date().getTime())
      );
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

getOi("ETHUSDT", "5m");
