// deno-lint-ignore-file no-explicit-any
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { ConsoleColors, print } from "../../utils/print.ts";

import { enqueue } from "../../kv-utils/kv-enqueue.ts";

import { QueueMsg } from "../../../models/queue-task.ts";

import { PublicTradeObj } from "../../../models/bybit/public-trade-data.ts";

import { mapPtDataToObj } from "./map-public-trade-data-to-obj.ts";
import { resetPublicTradeRecord } from "./reset-public-trade-record.ts";
import { updatePublicTradeRecord } from "./update-public-trade-record.ts";
import { PublicTradeRecord } from "../../../models/bybit/public-trade-record.ts";

import { UnixToTime } from "../../utils/time-converter.ts";
import { isCandleIsUp } from "../../utils/is-candle-up.ts";
import { KvOps } from "../../kv-utils/kv-ops.ts";
import { getTimeframeControl } from "../timeframe-control.ts";

const env = await load();

export function collectPublicTradeData(symbol: string, timeframe: string) {
  const url = `${env["BYBIT_FS_WS"]}`;
  const ws: WebSocketClient = new StandardWebSocketClient(url);
  let ptRecord: PublicTradeRecord = resetPublicTradeRecord(symbol);

  setInterval(async () => {
    const tfControl = getTimeframeControl(symbol);
    if (isCandleIsUp(timeframe)) {
      ptRecord.closeTime = tfControl?.closeTime || new Date().getTime() - 1500;
      const msg: QueueMsg = {
        timeframe: timeframe,
        queueName: KvOps.savePtObjToKv,
        data: {
          dataObj: ptRecord,
          closeTime: ptRecord.closeTime,
        },
      };
      await enqueue(msg);
      ptRecord = resetPublicTradeRecord(symbol);
    }
  }, 900);

  ws.on("open", function () {
    print(ConsoleColors.magenta, `BYBIT:${symbol} pt-ws --> connected`);
    ws.send(
      JSON.stringify({ op: "subscribe", args: [`publicTrade.${symbol}`] })
    );
  });

  ws.on("message", function (message: any) {
    const data = JSON.parse(message.data);
    if (data.type && data.type == "snapshot") {
      const objs: PublicTradeObj[] = mapPtDataToObj(data.data);
      ptRecord = updatePublicTradeRecord(ptRecord, objs);
    }
  });

  ws.on("ping", (data: Uint8Array) => {
    print(ConsoleColors.green, `${symbol} ${timeframe} kline ---> ping`);
    // Send a pong frame with the same payload
    ws.send(data);
  });

  ws.on("error", function (error: Error) {
    console.log(error);
    //print(ConsoleColors.red, `${symbol} kline-ws is broken`);
    //throw error;
  });

  ws.on("close", function () {
    console.log("PublicTrade WS is closed");
  });
}
