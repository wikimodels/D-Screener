import * as Binance from "npm:binance";
import { UMFutures } from "npm:@binance/futures-connector";
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { ConsoleColors, print } from "./functions/utils/print.ts";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
const env = await load();
const listenKeyClient = new UMFutures(
  env["BINANCE_TESTNET_API_KEY"],
  env["BINANCE_TESTNET_SECRET_KEY"],
  {
    baseURL: env["BINANCE_REST_TESTNET"],
  }
);
let listenKey = await getListenKey(listenKeyClient);
let url = `${env["BINACE_WS_TESTNET"]}/ws/${listenKey}`;

async function reconnectLoop() {
  try {
    const ws: WebSocketClient = new StandardWebSocketClient(url);
    ws.on("open", function () {
      JSON.stringify({
        method: "SUBSCRIBE",
        params: ["order"],
      });
      print(ConsoleColors.green, `Binance/UserData --> connected`);
    });
    ws.on("message", async function (message: any) {
      const data: any = JSON.parse(message.data);
      console.log(data);
      if (data.e == "listenKeyExpired") {
        listenKey = data.listenKey;
        ws.close(1000, "Connection closed normally");
      }
    });
    ws.on("ping", (data: Uint8Array) => {
      print(ConsoleColors.green, `Binance/UserData ---> ping`);
      // Send a pong frame with the same payload
      ws.send(data);
    });
    ws.on("error", function (error: Error) {
      print(ConsoleColors.red, `Binance/UserData is broken`);
      throw error;
    });
    ws.on("close", async function () {
      console.log("Binance/UserData is closed");
      //listenKey = await getListenKey(listenKeyClient);
      url = `${env["BINACE_WS_TESTNET"]}/ws/${listenKey}`;
      reconnectLoop();
    });
  } catch (error) {
    console.error(`Connection error: ${error.message}`);
  }
}

async function getListenKey(client: any): Promise<string> {
  const listenKey = (await client.createListenKey()).data.listenKey;
  return listenKey;
}

reconnectLoop();
