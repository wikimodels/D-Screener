// deno-lint-ignore-file no-explicit-any
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { KlineData } from "../../../models/binance/kline.ts";
import { setTimeframeControl } from "../timeframe-control/timeframe-control.ts";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { ConsoleColors, print } from "../../utils/print.ts";
import { collectOiData } from "../oi/collect-oi-data.ts";

import { createKlineObj } from "./create-kline-obj.ts";
import { insertKlineWsDataIntoObj } from "./insert-kline-ws-data-into-obj.ts";
import { getOiUpdateStatus } from "../oi/get-oi-update-status.ts";
import { SYNQ } from "../timeframe-control/synq.ts";
import { testReport } from "../../test.report.ts";

const env = await load();

export function collectKlineData(symbol: string) {
  const timeframe: string = SYNQ.wsTimeframe;
  const ws: WebSocketClient = new StandardWebSocketClient(
    `${env["BINANCE_SPOT_WS"]}${symbol.toLowerCase()}@kline_${timeframe}`
  );
  ws.on("open", function () {
    print(ConsoleColors.green, `${symbol} kline-ws --> connected`);
  });
  ws.on("message", async function (message: any) {
    const data: KlineData = JSON.parse(message.data);
    setTimeframeControl({
      symbol: symbol,
      openTime: data.k.t,
      closeTime: data.k.T,
      isClosed: false,
    });
    createKlineObj(data);
    //x => IS CANDLE CLOSED?
    if (data.k.x == true) {
      insertKlineWsDataIntoObj(data);

      if (!getOiUpdateStatus(data)) {
        const openTime: number = data.k.t;
        const closeTime: number = data.k.T;
        await collectOiData(symbol, openTime, closeTime);
      }
      testReport();
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
    print(ConsoleColors.red, `${symbol} kline-ws is broken`);
    throw error;
  });
  ws.on("close", function () {
    console.log("THIS shithole is closed");
  });
}
