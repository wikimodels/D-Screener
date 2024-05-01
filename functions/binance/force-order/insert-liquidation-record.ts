import { candlesRepo } from "../candles-repo/create-candles-repo.ts";
import { LiquidationRecord } from "../../../models/binance/liquidation-record.ts";
import { TimeframeControl } from "../../../models/binance/timeframe-control.ts";
export function insertLiquidationRecord(
  tfControl: TimeframeControl,
  record: LiquidationRecord
) {
  candlesRepo.forEach((r) => {
    if (r.symbol == record.symbol) {
      r.data.forEach((d) => {
        if (
          d.openTime == tfControl.openTime &&
          d.closeTime == tfControl.closeTime
        ) {
          if (!d.liquidations.buy.isUpdated) {
            d.liquidations.buy.liqSum = record.buy.liqSum;
            d.liquidations.buy.counter = record.buy.counter;
            d.liquidations.buy.isUpdated = true;
          }
          if (!d.liquidations.sell.isUpdated) {
            d.liquidations.sell.liqSum = record.sell.liqSum;
            d.liquidations.sell.counter = record.sell.counter;
            d.liquidations.sell.isUpdated = true;
          }
        }
      });
    }
  });
}
