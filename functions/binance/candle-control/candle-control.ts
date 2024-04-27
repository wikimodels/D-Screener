import { CandleControl } from "./../../../models/binance/candle-control.ts";
let candleControl: CandleControl = {
  openTime: 0,
  closeTime: 0,
  isClosed: false,
};

export function getCandleControl() {
  return candleControl;
}

export function setCandleControl(_candleControl: CandleControl) {
  candleControl = _candleControl;
}
