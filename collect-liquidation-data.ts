// deno-lint-ignore-file no-explicit-any no-explicit-any
const env = await load();
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";

import {
  LiquidationData,
  LiquidationObj,
} from "./models/binance/liquidation-obj.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import loadCSV from "./functions/utils/load-csv.ts";
import writeToCSV from "./functions/utils/write-to-csv.ts";

async function collectLiquidationData() {
  const coins: any[] = await loadCSV("./assets/data/coins.csv");

  const ws: WebSocketClient = new StandardWebSocketClient(
    env["BINANCE_ALL_LIQUIDATIONS"]
  );
  ws.on("open", function () {
    console.log("ws connected!");
  });
  ws.on("message", async function (message: any) {
    const data: LiquidationData = JSON.parse(message.data);
    const obj = getLiquidationObj(data);
    if (coins.find((c) => c.symbol == obj.symbol)) {
    }
  });
  ws.on("error", function (error: any) {
    console.log(error);
  });
}

function getLiquidationObj(data: LiquidationData): LiquidationObj {
  const obj: LiquidationObj = {
    timestamp: data.o.T,
    symbol: data.o.s,
    side: data.o.S,
    liqSum: data.o.ap * data.o.l,
  };

  return obj;
}

export default collectLiquidationData;
