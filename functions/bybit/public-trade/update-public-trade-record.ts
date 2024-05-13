import { PublicTradeObj } from "../../../models/bybit/public-trade-data.ts";
import { PublicTradeRecord } from "../../../models/bybit/public-trade-record.ts";

export function updatePublicTradeRecord(
  ptRecord: PublicTradeRecord,
  objs: PublicTradeObj[]
) {
  objs.forEach((o) => {
    ptRecord.numberOfTrades += 1;
    if (o.side == "Buy") {
      ptRecord.takerBuyBaseVolume += o.tradeSize;
      ptRecord.takerBuyQuoteVolume += o.tradeSize * o.tradePrice;
    }
    if (o.side == "Sell") {
      ptRecord.takerSellBaseVolume += o.tradeSize;
      ptRecord.takerSellQuoteVolume += o.tradeSize * o.tradePrice;
    }
  });

  return ptRecord;
}
