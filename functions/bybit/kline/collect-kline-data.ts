// deno-lint-ignore-file no-explicit-any
import { WebsocketClient } from "npm:bybit-api";

import { ConsoleColors, print } from "../../utils/print.ts";

import { enqueue } from "../../kv-utils/kv-enqueue.ts";
import { TimeframeControl } from "../../../models/shared/timeframe-control.ts";

import { QueueMsg } from "../../../models/queue-task.ts";
import { setTimeframeControl } from "../../binance/timeframe-control.ts";
import { KlineData } from "../../../models/bybit/kline-data.ts";
import { mapKlineWsDataIntoObj } from "./map-kline-ws-data-into-obj.ts";
import { KlineObj } from "../../../models/shared/kline.ts";
import { convertTimeframe } from "../../utils/convert-timeframe.ts";
import { oiRecordExists } from "../../shared/oi-record-exists.ts";
import { collectOiData } from "../oi/collect-oi-data.ts";
import { collectFrData } from "../fr/collect-fr-data.ts";
import { frRecordExists } from "../fr/fr-record-exists.ts";

const ws = new WebsocketClient({
  testnet: false,
  market: "v5",
  reconnectTimeout: 500,
  pingInterval: 30 * 1000,
});

export function collectKlineData(symbol: string, timeframe: string) {
  const timeframeInMin = convertTimeframe(timeframe);
  ws.subscribeV5(`kline.${timeframeInMin}.${symbol}`, "spot");

  ws.on("open", function () {
    print(ConsoleColors.green, `${symbol} kline-ws --> connected`);
  });
  ws.on("update", async function (message: any) {
    const data: KlineData = message.data[0];

    //x => IS CANDLE CLOSED?
    if (data.confirm == true) {
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
        queueName: "insertKlineWsDataIntoObj",
        data: {
          dataObj: obj,
          closeTime: obj.closeTime,
        },
      };
      await enqueue(msg);

      if (!(await oiRecordExists(obj, timeframe))) {
        await collectOiData(symbol, obj.closeTime, timeframe);
      }
      if (!(await frRecordExists(obj, timeframe))) {
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
