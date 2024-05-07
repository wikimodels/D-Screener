import { LiquidationRecord } from "../../../models/binance/liquidation-record.ts";

export function resetLiquidationRecord(symbol: string): LiquidationRecord {
  const obj: LiquidationRecord = {
    symbol: symbol,
    buy: { liqSum: 0, counter: 0 },
    sell: { liqSum: 0, counter: 0 },
    closeTime: 0,
  };
  return obj;
}
