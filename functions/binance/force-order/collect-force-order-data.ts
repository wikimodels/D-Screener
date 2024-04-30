import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import {
  ForceOrderData,
  ForceOrderObj,
} from "../../../models/binance/force-order.ts";
import { getCandleControl } from "../timeframe-control/timeframe-control.ts";
import { mapForceOrderDataToObj } from "./map-force-order-data-to-obj.ts";
import { ConsoleColors } from "./../../utils/print.ts";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { print } from "../../utils/print.ts";

const env = await load();

export async function collectForeOrderData(symbol: string) {
  //let liqCounter = createLiquidationCounter(coins);

  const ws: WebSocketClient = new StandardWebSocketClient(
    `${env["BINANCE_FWS_BASE"]}${symbol.toLowerCase()}@forceOrder`
  );

  ws.on("open", function () {
    print(ConsoleColors.yellow, `${symbol} forceOrder-ws --> connected`);
  });

  ws.on("message", function (message: any) {
    if (getCandleControl(symbol)?.isClosed == true) {
      const data: ForceOrderData = JSON.parse(message.data);
      const obj: ForceOrderObj = mapForceOrderDataToObj(data);
      console.log(obj);
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
