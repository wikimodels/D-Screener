import { TimeframeControl } from "../../../models/binance/timeframe-control.ts";
import { createTimeframeRepo } from "./create-timeframe-repo.ts";

const tfControls: TimeframeControl[] = await createTimeframeRepo();

export function getTimeframeControl(symbol: string) {
  return tfControls.find((c) => c.symbol == symbol);
}

export function setTimeframeControl(tfControl: TimeframeControl) {
  const index = tfControls.findIndex((c) => c.symbol == tfControl.symbol);
  if (index == -1) {
    throw Error(`${tfControl.symbol} is NOT found in tfControls!`);
  }
  tfControls.splice(index, 1, tfControl);
}
