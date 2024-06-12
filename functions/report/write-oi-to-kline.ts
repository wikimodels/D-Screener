import { KlineObj } from "../../models/shared/kline.ts";
import { getOiBySymbol } from "./get-oi-by-symbol.ts";

export async function writeOiToKline(
  timeframe: string,
  symbol: string,
  kline: KlineObj[]
) {
  const fr = await getOiBySymbol(timeframe, symbol);
  kline.forEach((k: KlineObj) => {
    fr.forEach((el) => {
      if (k.closeTime == el.closeTime) {
        k.oi = el;
      }
    });
  });
  return kline;
}
