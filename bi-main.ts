// deno-lint-ignore-file no-explicit-any no-explicit-any

import * as _ from "https://cdn.skypack.dev/lodash";
import { collectKlineData } from "./functions/binance/kline/collect-kline-data.ts";
import { collectMarkPriceData } from "./functions/binance/mark-price-update/collect-mark-price-update-data.ts";
import { collectForceOrderData } from "./functions/binance/force-order/collect-force-order-data.ts";
import { loadInitalKlineData } from "./functions/binance/kline/load-initial-kline-data.ts";
import { loadInitialOiData } from "./functions/binance/oi/load-initial-oi-data.ts";
import { enqueue } from "./functions/kv-utils/kv-enqueue.ts";
import { QueueMsg } from "./models/queue-task.ts";
import { KvOps } from "./functions/kv-utils/kv-ops.ts";

export async function biMain(timeframe: string, coins: any[]) {
  for await (const coin of coins) {
    const data = await loadInitalKlineData(coin.symbol, timeframe);

    data.forEach(async (item) => {
      const msg: QueueMsg = {
        timeframe: timeframe,
        queueName: KvOps.saveKlineObjToKv,
        data: { dataObj: item, closeTime: item.closeTime },
      };
      await enqueue(msg);
    });
  }

  for await (const coin of coins) {
    await loadInitialOiData(coin.symbol, timeframe);
  }

  coins.forEach((c) => {
    collectForceOrderData(c.symbol, timeframe);
    collectKlineData(c.symbol, timeframe);
    collectMarkPriceData(c.symbol, timeframe);
  });
}
