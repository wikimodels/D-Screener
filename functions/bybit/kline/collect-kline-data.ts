// deno-lint-ignore-file no-explicit-any
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";

import { setTimeframeControl } from "../timeframe-control.ts";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { ConsoleColors, print } from "../../utils/print.ts";
import { collectOiData } from "../oi/collect-oi-data.ts";

import { enqueue } from "../../kv-utils/kv-enqueue.ts";
import { TimeframeControl } from "../../../models/shared/timeframe-control.ts";
import { oiRecordExists } from "../../shared/oi-record-exists.ts";
import { mapKlineWsDataIntoObj } from "./map-kline-ws-data-into-obj.ts";
import { QueueMsg } from "../../../models/queue-task.ts";
import { KlineData } from "../../../models/bybit/kline-data.ts";
import { frRecordExists } from "../fr/fr-record-exists.ts";
import { collectFrData } from "../fr/collect-fr-data.ts";
import { KlineObj } from "../../../models/shared/kline.ts";
import { convertTimeframeFromStrToNum } from "../../utils/convert-timeframe.ts";
import { KvOps } from "../../kv-utils/kv-ops.ts";

const env = await load();

export function collectKlineData(symbol: string, timeframe: string) {
  const timeframeInMin = convertTimeframeFromStrToNum(timeframe);
  const url = `${env["BYBIT_SPOT_WS"]}`;
  const ws: WebSocketClient = new StandardWebSocketClient(url);

  ws.on("open", function () {
    print(
      ConsoleColors.green,
      `BYBIT:${symbol} ${timeframe} kline-ws --> connected`
    );
    ws.send(
      JSON.stringify({
        op: "subscribe",
        args: [`kline.${timeframeInMin}.${symbol}`],
      })
    );
  });

  ws.on("message", async function (message: any) {
    const obj = JSON.parse(message.data);

    if (obj.type) {
      const data: KlineData = obj.data[0];

      if (data.confirm == true) {
        console.log("Candle is UP");
        const tfControl: TimeframeControl = {
          openTime: data.start,
          closeTime: data.end,
          isClosed: true,
          symbol: symbol,
        };
        setTimeframeControl(tfControl);
        const obj: KlineObj = mapKlineWsDataIntoObj(data, symbol);

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
          setTimeout(async () => {
            await collectOiData(symbol, obj.closeTime, timeframe);
          }, 5 * 1000);
        }
        if (!(await frRecordExists(obj.symbol, obj.closeTime, timeframe))) {
          await collectFrData(obj.symbol, obj.closeTime, timeframe);
        }
      } else {
        setTimeframeControl({
          symbol: symbol,
          openTime: data.start,
          closeTime: data.end,
          isClosed: false,
        });
      }
    }
  });
  ws.on("update", async function (message: any) {
    const data: KlineData = message.data.data[0];

    if (data.confirm == true) {
      console.log("Candle is closed", Number(new Date().getTime));
      const tfControl: TimeframeControl = {
        openTime: data.start,
        closeTime: data.end,
        isClosed: true,
        symbol: symbol,
      };
      setTimeframeControl(tfControl);
      const obj: KlineObj = mapKlineWsDataIntoObj(data, symbol);

      const msg: QueueMsg = {
        timeframe: timeframe,
        queueName: KvOps.saveKlineObjToKv,
        data: {
          dataObj: obj,
          closeTime: obj.closeTime,
        },
      };
      await enqueue(msg);

      setTimeout(async () => {
        await collectOiData(symbol, obj.closeTime, timeframe);
      }, 10 * 1000);

      if (!(await frRecordExists(obj.symbol, obj.closeTime, timeframe))) {
        await collectFrData(obj.symbol, obj.closeTime, timeframe);
      }
    } else {
      setTimeframeControl({
        symbol: symbol,
        openTime: 0,
        closeTime: 0,
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
    console.log(error);
    //print(ConsoleColors.red, `${symbol} kline-ws is broken`);
    //throw error;
  });

  ws.on("close", function () {
    console.log("THIS shithole is closed");
  });
}
