import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { KlineData, KlineObj } from "../../../models/binance/kline.ts";
import {
  setCandleControl,
  getCandleControl,
} from "../candle-control/candle-control.ts";
import { mapKlineDataToObj } from "./map-kline-data-to-obj.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

const env = await load();

export async function collectKlineData() {
  const ws: WebSocketClient = new StandardWebSocketClient(
    env["BINANCE_SPOT_WS"] + "ethusdt@kline_1m"
  );
  ws.on("open", function () {
    console.log("----- KLINE WS CONNECTED -----");
  });
  ws.on("message", async function (message: any) {
    const data: KlineData = JSON.parse(message.data);
    const obj: KlineObj = mapKlineDataToObj(data);
    if (obj.isCandleClosed == true) {
      console.log("============= ROUND ===========");
      setCandleControl({
        openTime: obj.openTime,
        closeTime: obj.closeTime,
        isClosed: true,
      });
      console.log("KLINE SHIT_COUNT", getCandleControl());
    } else {
      setCandleControl({
        openTime: 0,
        closeTime: 0,
        isClosed: false,
      });
    }
  });

  ws.on("error", function (error: Error) {
    console.log(error);
  });
  ws.on("close", function () {
    console.log("THIS shithole is closed");
  });
}
