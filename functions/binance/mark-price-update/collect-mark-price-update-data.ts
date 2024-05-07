// deno-lint-ignore-file no-explicit-any
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { MarkPriceUpdateData } from "../../../models/binance/mark-price-update.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { print, ConsoleColors } from "../../utils/print.ts";
import { getTimeframeControl } from "../timeframe-control/timeframe-control.ts";

import { enqueue } from "../../kv-utils/kv-enqueue.ts";

import { FundingRate } from "../../../models/binance/funding-rate.ts";
import { QueueMsg } from "../../../models/queue-task.ts";
import { mapMarkUpdateDataToObj } from "./map-mark-update-data-to-obj.ts";

const env = await load();

export function collectMarkPriceData(symbol: string, timeframe: string) {
  const ws: WebSocketClient = new StandardWebSocketClient(
    `${env["BINANCE_FWS_BASE"]}${symbol.toLowerCase()}@markPrice`
  );
  ws.on("open", function () {
    print(ConsoleColors.cyan, `${symbol} markPrice --> connected`);
  });
  ws.on("message", async function (message: any) {
    const tfControl = getTimeframeControl(symbol);
    const data: MarkPriceUpdateData = JSON.parse(message.data);

    if (tfControl && tfControl.closeTime && tfControl.closeTime != 0) {
      const obj: FundingRate = mapMarkUpdateDataToObj(
        data,
        tfControl.closeTime
      );
      const msg: QueueMsg = {
        data: {
          closeTime: tfControl.closeTime,
          dataObj: obj as FundingRate,
        },
        queueName: "insertFundingRateRecord",
        timeframe: timeframe,
      };
      await enqueue(msg);
    }
  });
  ws.on("ping", (data: Uint8Array) => {
    print(ConsoleColors.cyan, `${symbol} markPrice --> ping`);
    // Send a pong frame with the same payload
    ws.send(data);
  });
  ws.on("error", function (error: Error) {
    print(ConsoleColors.red, `${symbol} markPrice-ws is broken`);
    throw error;
  });
}
