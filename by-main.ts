import { collectKlineData } from "./functions/bybit/kline/collect-kline-data.ts";
import { loadInitalKlineData } from "./functions/bybit/kline/load-initial-kline-data.ts";
import { collectLiqData } from "./functions/bybit/liq/collect-liq-data.ts";
import { loadInitialOiData } from "./functions/bybit/oi/load-initial-oi-data.ts";
import { collectPublicTradeData } from "./functions/bybit/public-trade/collect-pt-data.ts";

export async function byMain(timeframe: string, coins: any[]) {
  for await (const coin of coins) {
    await loadInitalKlineData(coin.symbol, timeframe);
  }

  for await (const coin of coins) {
    await loadInitialOiData(coin.symbol, timeframe);
  }

  coins.forEach((c) => {
    collectKlineData(c.symbol, timeframe);
    collectLiqData(c.symbol, timeframe);
    collectPublicTradeData(c.symbol, timeframe);
  });
}
