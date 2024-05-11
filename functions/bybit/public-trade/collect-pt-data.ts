// deno-lint-ignore-file no-explicit-any
import { WebsocketClient } from "npm:bybit-api";

import { ConsoleColors, print } from "../../utils/print.ts";

import { enqueue } from "../../kv-utils/kv-enqueue.ts";

import { QueueMsg } from "../../../models/queue-task.ts";
import { getTimeframeControl } from "../timeframe-control.ts";

import { PublicTradeRecord } from "../../../models/bybit/public-trade-record.ts";
import { PublicTradeObj } from "../../../models/bybit/public-trade-data.ts";
import { resetPublicTradeRecord } from "./reset-public-trade-record.ts";
import { mapPtDataToObj } from "./map-public-trade-data-to-obj.ts";
import { updatePublicTradeRecord } from "./update-public-trade-record.ts";

const ws = new WebsocketClient({
  testnet: false,
  market: "v5",
  reconnectTimeout: 500,
  pingInterval: 30 * 1000,
});

export function collectPublicTradData(symbol: string, timeframe: string) {
  let ptRecord: PublicTradeRecord = resetPublicTradeRecord(symbol);

  ws.subscribeV5(`publicTrade.${symbol}`, "linear");

  ws.on("open", function () {
    print(ConsoleColors.magenta, `${symbol} bybit pt-ws --> connected`);
  });

  ws.on("update", async function (message: any) {
    const obj: PublicTradeObj = mapPtDataToObj(JSON.parse(message.data));

    const tfControl = getTimeframeControl(symbol);
    ptRecord = updatePublicTradeRecord(
      ptRecord,
      obj,
      tfControl?.closeTime || 0
    );

    if (tfControl?.isClosed == true) {
      ptRecord.closeTime = tfControl?.closeTime;
      const msg: QueueMsg = {
        timeframe: timeframe,
        queueName: "insertPublicTradeRecord",
        data: {
          dataObj: ptRecord,
          closeTime: tfControl.closeTime,
        },
      };
      await enqueue(msg);
      ptRecord = resetPublicTradeRecord(symbol);
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
