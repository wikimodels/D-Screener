import { PublicTradeObj } from "../../../models/bybit/public-trade-data.ts";
import { PublicTradeRecord } from "../../../models/bybit/public-trade-record.ts";

export function updatePublicTradeRecord(
  ptRecord: PublicTradeRecord,
  ptObj: PublicTradeObj,
  closeTime: number
) {
  ptRecord.closeTime == closeTime;
  ptRecord.numberOfTrades += 1;
  if (ptObj.side == "Buy") {
    ptRecord.takerBuyBaseVolume = +ptObj.tradeSize;
    ptRecord.takerBuyQuoteVolume = +ptObj.tradeSize * ptObj.tradeSize;
  }
  if (ptObj.side == "Sell") {
    ptRecord.takerSellBaseVolume = +ptObj.tradeSize;
    ptRecord.takerSellQuoteVolume = +ptObj.tradeSize * ptObj.tradeSize;
  }
  return ptRecord;
}
