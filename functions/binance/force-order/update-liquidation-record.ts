import { ForceOrderObj } from "../../../models/binance/force-order.ts";
import { LiquidationRecord } from "../../../models/binance/liquidation-record.ts";

export function updateLiquidationRecord(
  record: LiquidationRecord,
  obj: ForceOrderObj
): LiquidationRecord {
  if (obj.order.side == "BUY") {
    record.buy.liqSum += obj.order.lastFilledQty * obj.order.averagePrice;
  }
  if (obj.order.side == "BUY" && obj.order.orderStatus == "FILLED") {
    record.buy.counter += 1;
  }
  if (obj.order.side == "SELL") {
    record.sell.liqSum += obj.order.lastFilledQty * obj.order.averagePrice;
  }
  if (obj.order.side == "SELL" && obj.order.orderStatus == "FILLED") {
    record.sell.counter += 1;
  }
  return record;
}
