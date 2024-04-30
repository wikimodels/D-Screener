import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { KlineData, KlineObj } from "../../../models/binance/kline.ts";
import {
  setCandleControl,
  getCandleControl,
} from "../timeframe-control/timeframe-control.ts";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { ConsoleColors, print } from "../../utils/print.ts";
import { collectOiData } from "../oi/collect-oi-data.ts";

import { createKlineObj } from "./create-kline-obj.ts";
import { insertKlineWsDataIntoObj } from "./insert-kline-ws-data-into-obj.ts";

const env = await load();

export async function collectKlineData(symbol: string, timeframe: string) {
  const ws: WebSocketClient = new StandardWebSocketClient(
    `${env["BINANCE_SPOT_WS"]}${symbol.toLowerCase()}@kline_${timeframe}`
  );
  ws.on("open", function () {
    print(ConsoleColors.green, `${symbol} kline-ws --> connected`);
  });
  ws.on("message", async function (message: any) {
    const data: KlineData = JSON.parse(message.data);
    createKlineObj(data);
    //x => IS CANDLE CLOSED?
    if (data.k.x == true) {
      insertKlineWsDataIntoObj(data);
      await collectOiData(symbol, "5m");
      console.log("KLINE SHIT_COUNT", getCandleControl(symbol));
    } else {
      setCandleControl({
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
