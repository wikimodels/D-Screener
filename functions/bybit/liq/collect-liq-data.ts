// deno-lint-ignore-file no-explicit-any
import { WebsocketClient } from "npm:bybit-api";

import { ConsoleColors, print } from "../../utils/print.ts";

import { enqueue } from "../../kv-utils/kv-enqueue.ts";

import { QueueMsg } from "../../../models/queue-task.ts";
import { LiquidationRecord } from "../../../models/shared/liquidation-record.ts";
import { resetLiquidationRecord } from "../../shared/reset-liquidation-record.ts";
import { getTimeframeControl } from "../timeframe-control.ts";
import { LiquidationData } from "../../../models/bybit/liq-data.ts";
import { updateLiquidationRecord } from "./updata-liq-record.ts";

const ws = new WebsocketClient({
  testnet: false,
  market: "v5",
  reconnectTimeout: 500,
  pingInterval: 30 * 1000,
});

export function collectLiqData(symbol: string, timeframe: string) {
  let liquidationRecord: LiquidationRecord = resetLiquidationRecord(symbol);
  ws.subscribeV5(`liquidation.${symbol}`, "linear");

  ws.on("open", function () {
    print(ConsoleColors.green, `${symbol} bybit liq-ws --> connected`);
  });

  ws.on("update", async function (message: any) {
    const data: LiquidationData = JSON.parse(message.data);

    const tfControl = getTimeframeControl(symbol);
    liquidationRecord = updateLiquidationRecord(
      liquidationRecord,
      data,
      tfControl?.closeTime || 0
    );

    if (tfControl?.isClosed == true) {
      liquidationRecord.closeTime = tfControl?.closeTime;
      const msg: QueueMsg = {
        timeframe: timeframe,
        queueName: "insertLiquidationRecord",
        data: {
          dataObj: liquidationRecord,
          closeTime: tfControl.closeTime,
        },
      };
      await enqueue(msg);
      liquidationRecord = resetLiquidationRecord(symbol);
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
