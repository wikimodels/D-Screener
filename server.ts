import { datetime } from "https://deno.land/x/ptera@v1.0.2/mod.ts";
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
import { listenQueues } from "./functions/kv-utils/kv-listening.ts";
import { KlineObj } from "./models/binance/kline.ts";
import { ConsoleColors, print } from "./functions/utils/print.ts";
const env = await load();

const app = express();
const kv = await Deno.openKv();
app.get("/", async (req: any, res: any) => {
  try {
    const shit = await testReport();

    res.send(shit);
  } catch (e) {
    console.log(e);
  }
});

app.get("/oi", async (req: any, res: any) => {
  try {
    //const data = testReport();
    const data: any[] = [];

    res.send(data);
  } catch (e) {
    console.log(e);
  }
});

app.listen(8000, async () => {
  print(ConsoleColors.green, "Server ---> running...");
});

ws_main("1m");
listenQueues();
