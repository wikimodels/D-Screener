import { KlineObj } from "../../models/shared/kline.ts";
import { getLiqBySymbol } from "./get-liq-by-symbol.ts";

export async function writeLiqToKline(
  timeframe: string,
  symbol: string,
  kline: KlineObj[]
) {
  const liq = await getLiqBySymbol(timeframe, symbol);
  kline.forEach((k: KlineObj) => {
    liq.forEach((el) => {
      if (k.closeTime == el.closeTime) {
        k.liquidations = el;
      }
    });
  });
  return kline;
}
