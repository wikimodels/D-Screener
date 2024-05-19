import * as Binance from "npm:binance";
import { UMFutures } from "npm:@binance/futures-connector";
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { ConsoleColors, print } from "./functions/utils/print.ts";

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
const env = await load();

const orderClient = new Binance.USDMClient({
  api_key: env["BINANCE_TESTNET_API_KEY"],
  api_secret: env["BINANCE_TESTNET_SECRET_KEY"],
  baseUrl: env["BINANCE_REST_TESTNET"],
  beautifyResponses: true,
});

// orderClient
//   .submitNewOrder({
//     side: "SELL",
//     symbol: "BTCUSDT",
//     type: "MARKET",
//     quantity: 0.01,
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
console.log(env["BINANCE_TESTNET_API_KEY"]);
console.log(env["BINANCE_TESTNET_SECRET_KEY"]);
console.log(env["BINANCE_REST_TESTNET"]);
export async function collectUserData() {
  const listenKeyClient = new UMFutures(
    env["BINANCE_TESTNET_API_KEY"],
    env["BINANCE_TESTNET_SECRET_KEY"],
    {
      baseURL: env["BINANCE_REST_TESTNET"],
    }
  );
  const listenKey = (await listenKeyClient.createListenKey()).data.listenKey;

  const ws: WebSocketClient = new StandardWebSocketClient(
    `${env["BINACE_WS_TESTNET"]}/ws/${listenKey}`
  );
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
  });
  ws.on("ping", (data: Uint8Array) => {
    print(ConsoleColors.green, `Binance/UserData ---> ping`);
    // Send a pong frame with the same payload
    ws.send(data);
  });
  ws.on("error", function (error: Error) {
    print(ConsoleColors.red, `Binance/UserData is broken`);
    console.log(error);
  });
  ws.on("close", function () {
    console.log("Binance/UserData is closed");
  });
}
collectUserData();

//setInterval(() => {}, 60 * 1000);
