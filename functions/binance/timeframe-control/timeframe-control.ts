import { CandleControl } from "../../../models/binance/candle-control.ts";
import { createTimeframeRepo } from "./create-timeframe-repo.ts";

const candleControls: CandleControl[] = await createTimeframeRepo();

export function getCandleControl(symbol: string) {
  return candleControls.find((c) => c.symbol == symbol);
}

export function setCandleControl(candleControl: CandleControl) {
  const index = candleControls.findIndex(
    (c) => c.symbol == candleControl.symbol
  );
  if (index == -1) {
    throw Error(`${candleControl.symbol} is NOT found in CandleControls!`);
  }
  candleControls.splice(index, 1, candleControl);
}
