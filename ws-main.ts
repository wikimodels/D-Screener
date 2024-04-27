// deno-lint-ignore-file no-explicit-any no-explicit-any
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";

import { MarkPriceUpdateData } from "./models/binance/mark-price-update.ts";
import { MarkPriceUpdateObj } from "./models/binance/mark-price-update.ts";
import { ForceOrderData, ForceOrderObj } from "./models/binance/force-order.ts";

import * as _ from "https://cdn.skypack.dev/lodash";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
const env = await load();
import loadCSV from "./functions/utils/csv/load-csv.ts";

import { mapWsToKlineObj } from "./kline-turbo.ts";
import { mapMarkUpdateDataToObj } from "./functions/binance/mark-price-update/map-mark-update-data-to-obj.ts";

import { mapForceOrderDataToObj } from "./functions/binance/force-order/map-force-order-data-to-obj.ts";
import {
  setCandleControl,
  getCandleControl,
} from "./functions/binance/candle-control/candle-control.ts";
import { collectKlineData } from "./functions/binance/kline/collect-kline-data.ts";
const kv = await Deno.openKv();

async function collectLiquidationData() {
  //let liqCounter = createLiquidationCounter(coins);

  const ws: WebSocketClient = new StandardWebSocketClient(
    env["BINANCE_FWS_BASE"] + "ethusdt@forceOrder"
  );

  ws.on("open", function () {
    console.log("----- LIQUIDATIONS WS CONNECTED -----");
  });

  ws.on("message", function (message: any) {
    if (getCandleControl().isClosed == true) {
      const data: ForceOrderData = JSON.parse(message.data);
      const obj: ForceOrderObj = mapForceOrderDataToObj(data);
      console.log(obj);
    }
  });

  ws.on("error", function (error: Error) {
    console.log(error);
  });
}

async function collectMarkPriceData() {
  //let liqCounter = createLiquidationCounter(coins);

  const ws: WebSocketClient = new StandardWebSocketClient(
    env["BINANCE_FWS_BASE"] + "ethusdt@markPrice"
  );
  ws.on("open", function () {
    console.log("----- MARK PRICE WS CONNECTED -----");
  });
  ws.on("message", function (message: any) {
    const data: MarkPriceUpdateData = JSON.parse(message.data);
    const obj: MarkPriceUpdateObj = mapMarkUpdateDataToObj(data);
    if (getCandleControl().isClosed == true) {
      console.log("MARK PRICE SHIT IS ");
      console.log(obj.symbol, obj.fundingRate);
    }
  });

  ws.on("error", function (error: Error) {
    console.log("ERROR MESSAGE", error);
  });
}

async function ws_main() {
  collectLiquidationData();
  collectKlineData();
  collectMarkPriceData();
}
ws_main();
