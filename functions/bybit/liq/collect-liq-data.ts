// deno-lint-ignore-file no-explicit-any
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { ConsoleColors, print } from "../../utils/print.ts";

import { enqueue } from "../../kv-utils/kv-enqueue.ts";

import { QueueMsg } from "../../../models/queue-task.ts";
import { UnixToTime } from "../../utils/time-converter.ts";
import { isCandleIsUp } from "../../utils/is-candle-up.ts";
import { LiquidationRecord } from "../../../models/shared/liquidation-record.ts";
import { resetLiquidationRecord } from "../../shared/reset-liquidation-record.ts";
import { LiquidationData } from "../../../models/bybit/liq-data.ts";
import { updateLiquidationRecord } from "./updata-liq-record.ts";
import { KvOps } from "../../kv-utils/kv-ops.ts";
import { getTimeframeControl } from "../timeframe-control.ts";

const env = await load();

export function collectLiqData(symbol: string, timeframe: string) {
  const url = `${env["BYBIT_FS_WS"]}`;
  const ws: WebSocketClient = new StandardWebSocketClient(url);
  let liquidationRecord: LiquidationRecord = resetLiquidationRecord(symbol);

  setInterval(async () => {
    const tfControl = getTimeframeControl(symbol);
    if (isCandleIsUp(timeframe)) {
      liquidationRecord.closeTime =
        tfControl?.closeTime || new Date().getTime() - 1500;
      const msg: QueueMsg = {
        timeframe: timeframe,
        queueName: KvOps.saveLiqObjToKv,
        data: {
          dataObj: liquidationRecord,
          closeTime: liquidationRecord.closeTime,
        },
      };
      await enqueue(msg);
      liquidationRecord = resetLiquidationRecord(symbol);
    }
  }, 500);

  ws.on("open", function () {
    print(ConsoleColors.cyan, `BYBIT:${symbol} liq-ws --> connected`);
    ws.send(
      JSON.stringify({ op: "subscribe", args: [`liquidation.${symbol}`] })
    );
  });

  ws.on("message", function (message: any) {
    const data = JSON.parse(message.data);

    if (data.type && data.type == "snapshot") {
      const _data: LiquidationData = data.data;
      liquidationRecord = updateLiquidationRecord(liquidationRecord, _data, 0);
    }
  });

  ws.on("ping", (data: Uint8Array) => {
    print(ConsoleColors.green, `${symbol} kline ---> ping`);
    // Send a pong frame with the same payload
    ws.send(data);
  });

  ws.on("error", function (error: Error) {
    console.log(error);
    //print(ConsoleColors.red, `${symbol} kline-ws is broken`);
    //throw error;
  });

  ws.on("close", function () {
    console.log("THIS shithole is closed");
  });
}
