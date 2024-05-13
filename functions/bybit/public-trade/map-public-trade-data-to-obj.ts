import { PublicTradeObj } from "../../../models/bybit/public-trade-data.ts";

export function mapPtDataToObj(data: any[]): PublicTradeObj[] {
  const objs: PublicTradeObj[] = [];
  data.forEach((d: any) => {
    const obj: PublicTradeObj = {
      symbol: d.s,
      side: d.S,
      tradeSize: Number(d.v),
      tradePrice: Number(d.p),
    };
    objs.push(obj);
  });

  return objs;
}
