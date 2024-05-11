import { PublicTradeObj } from "../../../models/bybit/public-trade-data.ts";

export function mapPtDataToObj(data: any): PublicTradeObj {
  const obj: PublicTradeObj = {
    symbol: data.s,
    side: data.S,
    tradeSize: Number(data.v),
    tradePrice: Number(data.p),
  };
  return obj;
}
