import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import {
  MarkPriceUpdateData,
  MarkPriceUpdateObj,
} from "../../../models/binance/mark-price-update.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { print, ConsoleColors } from "../../utils/print.ts";
import { getCandleControl } from "../timeframe-control/timeframe-control.ts";
import { mapMarkUpdateDataToObj } from "./map-mark-update-data-to-obj.ts";

const env = await load();

export async function collectMarkPriceData(symbol: string) {
  const ws: WebSocketClient = new StandardWebSocketClient(
    `${env["BINANCE_FWS_BASE"]}${symbol.toLowerCase()}@markPrice`
  );
  ws.on("open", function () {
    print(ConsoleColors.cyan, `${symbol} markPrice --> connected`);
  });
  ws.on("message", function (message: any) {
    const data: MarkPriceUpdateData = JSON.parse(message.data);
    const obj: MarkPriceUpdateObj = mapMarkUpdateDataToObj(data);
    if (getCandleControl(symbol)?.isClosed == true) {
      console.log("MARK PRICE SHIT IS ");
      console.log(obj.symbol, obj.fundingRate);
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
