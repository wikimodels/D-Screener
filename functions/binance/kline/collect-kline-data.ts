// deno-lint-ignore-file no-explicit-any
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { KlineData, KlineObj } from "../../../models/shared/kline.ts";
import { setTimeframeControl } from "../timeframe-control.ts";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { ConsoleColors, print } from "../../utils/print.ts";
import { collectOiData } from "../oi/collect-oi-data.ts";

import { enqueue } from "../../kv-utils/kv-enqueue.ts";
import { TimeframeControl } from "../../../models/shared/timeframe-control.ts";
import { oiRecordExists } from "../../shared/oi-record-exists.ts";
import { mapKlineWsDataIntoObj } from "./map-kline-ws-data-into-obj.ts";
import { QueueMsg } from "../../../models/queue-task.ts";
import { KvOps } from "../../kv-utils/kv-ops.ts";

const env = await load();

export function collectKlineData(symbol: string, timeframe: string) {
  const ws: WebSocketClient = new StandardWebSocketClient(
    `${env["BINANCE_SPOT_WS"]}${symbol.toLowerCase()}@kline_${timeframe}`
  );
  ws.on("open", function () {
    print(
      ConsoleColors.green,
      `BINANCE:${symbol} ${timeframe} kline-ws --> connected`
    );
  });
  ws.on("message", async function (message: any) {
    const data: KlineData = JSON.parse(message.data);
    setTimeframeControl({
      symbol: symbol,
      openTime: data.k.t,
      closeTime: data.k.T,
      isClosed: false,
    });

    //x => IS CANDLE CLOSED?
    if (data.k.x == true) {
      const tfControl: TimeframeControl = {
        openTime: data.k.t,
        closeTime: data.k.T,
        isClosed: true,
        symbol: symbol,
      };
      setTimeframeControl(tfControl);
      const obj: KlineObj = mapKlineWsDataIntoObj(data);
      const msg: QueueMsg = {
        timeframe: timeframe,
        queueName: KvOps.saveKlineObjToKv,
        data: {
          dataObj: obj,
          closeTime: obj.closeTime,
        },
      };
      await enqueue(msg);

      if (!(await oiRecordExists(obj.symbol, obj.closeTime, timeframe))) {
        await collectOiData(symbol, obj.closeTime, timeframe);
      }
    } else {
      setTimeframeControl({
        symbol: symbol,
        openTime: data.k.t,
        closeTime: data.k.T,
        isClosed: false,
      });
    }
  });
  ws.on("ping", (data: Uint8Array) => {
    print(ConsoleColors.green, `${symbol} kline ---> ping`);
    // Send a pong frame with the same payload
    ws.send(data);
  });
  ws.on("error", function (error: Error) {
    print(ConsoleColors.red, `${symbol} kline-ws is broken`);
    throw error;
  });
  ws.on("close", function () {
    console.log("THIS shithole is closed");
  });
}
