import { collectKlineData } from "./functions/bybit/kline/collect-kline-data.ts";

export function bybitWsMain(timeframeInMin: 1) {
  collectKlineData("ETHUSDT", timeframeInMin);
}

bybitWsMain(1);
