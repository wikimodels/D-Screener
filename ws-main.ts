// deno-lint-ignore-file no-explicit-any no-explicit-any

import * as _ from "https://cdn.skypack.dev/lodash";

import { collectKlineData } from "./functions/binance/kline/collect-kline-data.ts";
import { collectMarkPriceData } from "./functions/binance/mark-price-update/collect-mark-price-update-data.ts";
import { collectForeOrderData } from "./functions/binance/force-order/collect-force-order-data.ts";
import { getAllCoins } from "./functions/utils/get-coins.ts";

import { loadInitalKlineData } from "./functions/binance/kline/load-initial-kline-data.ts";
import { loadInitialOiData } from "./functions/binance/oi/load-initial-oi-data.ts";
//import { createCandlesRepo } from "./functions/kv-utils/create-candles-repo.ts";
import { enqueue } from "./functions/kv-utils/kv-enqueue.ts";
import { cleanKv } from "./functions/kv-utils/clean-kv.ts";
import { ConsoleColors, print } from "./functions/utils/print.ts";

export async function ws_main() {
  await cleanKv("15m")
    .then(() => {
      print(ConsoleColors.yellow, "15m-KVDB ---> cleaned");
    })
    .catch(console.error);

  const coins = await getAllCoins();
  for await (const coin of coins) {
    const data = await loadInitalKlineData(coin.symbol);

    data.forEach(async (item) => {
      await enqueue({
        kvNamespace: "15m",
        msg: {
          queueName: "loadInitalKlineObjToKv",
          data: { dataObj: item, closeTime: item.closeTime },
        },
      });
    });
  }
  for await (const coin of coins) {
    const data = await loadInitialOiData(coin.symbol);
    data.forEach(async (item) => {
      await enqueue({
        kvNamespace: "15m",
        msg: {
          queueName: "loadOiToInitialKlineObj",
          data: {
            dataObj: item,
            closeTime: 0,
          },
        },
      });
    });
  }
  coins.forEach((c) => {
    collectForeOrderData(c.symbol);
    collectKlineData(c.symbol);
    collectMarkPriceData(c.symbol);
  });
}
