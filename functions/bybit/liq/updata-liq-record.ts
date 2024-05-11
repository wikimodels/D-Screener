import { LiquidationData } from "../../../models/bybit/liq-data.ts";
import { LiquidationRecord } from "../../../models/shared/liquidation-record.ts";

export function updateLiquidationRecord(
  record: LiquidationRecord,
  data: LiquidationData,
  closeTime: number
): LiquidationRecord {
  if (data.side == "BUY") {
    record.buy.liqSum += data.price * data.size;
    record.buy.counter += 1;
  }

  if (obj.order.side == "SELL") {
    record.sell.liqSum += data.price * data.size;
    record.sell.counter += 1;
  }
  record.closeTime = closeTime;
  return record;
}
