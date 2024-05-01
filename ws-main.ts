// deno-lint-ignore-file no-explicit-any no-explicit-any

import * as _ from "https://cdn.skypack.dev/lodash";

import { collectKlineData } from "./functions/binance/kline/collect-kline-data.ts";
import { collectMarkPriceData } from "./functions/binance/mark-price-update/collect-mark-price-update-data.ts";
import { collectForeOrderData } from "./functions/binance/force-order/collect-force-order-data.ts";
import { getAllCoins } from "./functions/utils/get-coins.ts";

import { loadInitalKlineData } from "./functions/binance/kline/load-initial-kline-data.ts";
import { loadInitialOiData } from "./functions/binance/oi/load-initial-oi-data.ts";

export async function ws_main() {
  const coins = await getAllCoins();
  for await (const c of coins) {
    await loadInitalKlineData(c.symbol);
  }
  for await (const c of coins) {
    await loadInitialOiData(c.symbol);
  }
  coins.forEach((c) => {
    collectForeOrderData(c.symbol);
    collectKlineData(c.symbol);
    collectMarkPriceData(c.symbol);
  });
}
