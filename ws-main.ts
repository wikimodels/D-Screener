// deno-lint-ignore-file no-explicit-any no-explicit-any

import * as _ from "https://cdn.skypack.dev/lodash";

import { collectKlineData } from "./functions/binance/kline/collect-kline-data.ts";
import { collectMarkPriceData } from "./functions/binance/mark-price-update/collect-mark-price-update-data.ts";
import { collectForceOrderData } from "./functions/binance/force-order/collect-force-order-data.ts";
import { getAllCoins } from "./functions/utils/get-coins.ts";

import { loadInitalKlineData } from "./functions/binance/kline/load-initial-kline-data.ts";
import { loadInitialOiData } from "./functions/binance/oi/load-initial-oi-data.ts";
//import { createCandlesRepo } from "./functions/kv-utils/create-candles-repo.ts";
import { enqueue } from "./functions/kv-utils/kv-enqueue.ts";
import { cleanKv } from "./functions/kv-utils/clean-kv.ts";
import { ConsoleColors, print } from "./functions/utils/print.ts";
import { QueueMsg } from "./models/queue-task.ts";

export async function ws_main(timeframe: string) {
  await cleanKv()
    .then(() => {
      print(ConsoleColors.yellow, "KVDB ---> cleaned");
    })
    .catch(console.error);

  const coins = await getAllCoins();
  for await (const coin of coins) {
    const data = await loadInitalKlineData(coin.symbol, timeframe);

    data.forEach(async (item) => {
      const msg: QueueMsg = {
        timeframe: timeframe,
        queueName: "loadInitalKlineObjToKv",
        data: { dataObj: item, closeTime: item.closeTime },
      };
      await enqueue(msg);
    });
  }

  for await (const coin of coins) {
    const data = await loadInitialOiData(coin.symbol, timeframe);
    data.forEach(async (item) => {
      const msg: QueueMsg = {
        timeframe: timeframe,
        queueName: "loadOiToInitialKlineObj",
        data: {
          dataObj: item,
          closeTime: 0,
        },
      };
      await enqueue(msg);
    });
  }
  coins.forEach((c) => {
    collectForceOrderData(c.symbol, timeframe);
    collectKlineData(c.symbol, timeframe);
    collectMarkPriceData(c.symbol, timeframe);
  });
}
