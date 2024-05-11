// deno-lint-ignore-file no-explicit-any
import { WebsocketClient } from "npm:bybit-api";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { KlineData } from "../../models/bybit/kline-data.ts";
import { QueueMsg } from "../../models/queue-task.ts";
import { KlineObj } from "../../models/shared/kline.ts";
import { TimeframeControl } from "../../models/shared/timeframe-control.ts";
import { enqueue } from "../kv-utils/kv-enqueue.ts";
import { convertTimeframe } from "../utils/convert-timeframe.ts";
import { print, ConsoleColors } from "../utils/print.ts";
import { mapKlineWsDataIntoObj } from "./kline/map-kline-ws-data-into-obj.ts";
import { setTimeframeControl } from "./timeframe-control.ts";

const ws = new WebsocketClient({
  testnet: false,
  market: "v5",
  reconnectTimeout: 500,
  pingInterval: 30 * 1000,
});

const env = await load();
let counter = 0;
export function collectTickersData(symbol: string) {
  ws.subscribeV5(`tickers.${symbol}`, "linear");

  ws.on("open", function () {
    print(ConsoleColors.green, `${symbol} kline-ws --> connected`);
  });
  ws.on("update", async function (message: any) {
    if (message.type == "snapshot") {
      counter += 1;
      console.log("NOW", counter);
      console.log(message);
    }
  });
  // Optional: Listen to responses to websocket queries (e.g. the response after subscribing to a topic)
  ws.on("response", (response) => {
    //console.log("response", response);
  });

  // Optional: Listen to connection close event. Unexpected connection closes are automatically reconnected.
  ws.on("close", () => {
    console.log("connection closed");
  });

  // Optional: Listen to raw error events. Recommended.
  ws.on("error", (err) => {
    console.error("error", err);
  });
}
