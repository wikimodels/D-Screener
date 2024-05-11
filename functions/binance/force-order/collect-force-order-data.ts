// deno-lint-ignore-file no-explicit-any
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import {
  ForceOrderData,
  ForceOrderObj,
} from "../../../models/binance/force-order.ts";
import { getTimeframeControl } from "../timeframe-control.ts";
import { mapForceOrderDataToObj } from "./map-force-order-data-to-obj.ts";
import { ConsoleColors } from "./../../utils/print.ts";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { print } from "../../utils/print.ts";
import { LiquidationRecord } from "../../../models/shared/liquidation-record.ts";
import { resetLiquidationRecord } from "../../shared/reset-liquidation-record.ts";
import { updateLiquidationRecord } from "../../shared/update-liquidation-record.ts";
import { enqueue } from "../../kv-utils/kv-enqueue.ts";
import { QueueMsg } from "../../../models/queue-task.ts";

const env = await load();

export function collectForceOrderData(symbol: string, timeframe: string) {
  let liquidationRecord: LiquidationRecord = resetLiquidationRecord(symbol);

  const ws: WebSocketClient = new StandardWebSocketClient(
    `${env["BINANCE_FWS_BASE"]}${symbol.toLowerCase()}@forceOrder`
  );

  ws.on("open", function () {
    print(
      ConsoleColors.yellow,
      `binance ${symbol} forceOrder-ws --> connected`
    );
  });

  ws.on("message", async function (message: any) {
    const data: ForceOrderData = JSON.parse(message.data);
    const obj: ForceOrderObj = mapForceOrderDataToObj(data);
    const tfControl = getTimeframeControl(symbol);
    liquidationRecord = updateLiquidationRecord(
      liquidationRecord,
      obj,
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
  ws.on("ping", (data: Uint8Array) => {
    print(ConsoleColors.yellow, `${symbol} forceOrder ---> ping`);
    // Send a pong frame with the same payload
    ws.send(data);
  });
  ws.on("error", function (error: Error) {
    print(ConsoleColors.red, `${symbol} forceOrder-ws is broken`);
    throw error;
  });
}
