import { datetime } from "https://deno.land/x/ptera@v1.0.2/mod.ts";
// deno-lint-ignore-file
import express from "npm:express@4.18.2";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

import { testReport } from "./functions/test.report.ts";
import { SYNQ } from "./functions/shared/timeframe-control/synq.ts";
import { generateBinanceSignature } from "./functions/utils/generate-binance-signature.ts";
import {
  OpenInterest,
  OpenInterestData,
  OpenInterestHist,
} from "./models/shared/oi.ts";
import { UnixToTime } from "./functions/utils/time-converter.ts";
import { mapOiDataToObj } from "./functions/binance/oi/map-oi-data-to-obj.ts";
import { listenQueues } from "./functions/kv-utils/kv-listening.ts";
import { KlineObj } from "./models/shared/kline.ts";
import { ConsoleColors, print } from "./functions/utils/print.ts";
import { assembleKline } from "./functions/binance/kline/assemble-kline.ts";
import { ws_main } from "./bi-main.ts";
import { calculateChMf } from "./indicators/chmf.ts";
import { calculateVO } from "./indicators/vo.ts";
import { loadInitalKlineData } from "./functions/binance/kline/load-initial-kline-data.ts";
import { loadInitialOiData } from "./functions/bybit/oi/load-initial-oi-data.ts";
import { TF } from "./models/shared/timeframes.ts";
import { collectTickersData } from "./functions/bybit/test.ts";

const env = await load();

const app = express();

app.get("/", async (req: any, res: any) => {
  try {
    let shit = await testReport();

    res.send(shit);
  } catch (e) {
    console.log(e);
  }
});

app.get("/oi", async (req: any, res: any) => {
  try {
    //const data = testReport();
    const data: any[] = await loadInitalKlineData("BTCUSDT", 1);

    res.send({ fuck: data.length });
  } catch (e) {
    console.log(e);
  }
});

app.listen(8000, async () => {
  print(ConsoleColors.green, "Server ---> running...");
});

//loadInitialOiData("ETHUSDT", TF.m15);
//collectTickersData("ETHUSDT");
// ws_main("5m");
// listenQueues();
