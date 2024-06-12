import { KlineObj } from "../../models/shared/kline.ts";
import { getFrBySymbol } from "./get-fr-by-symbol.ts";

export async function writeFrToKline(
  timeframe: string,
  symbol: string,
  kline: KlineObj[]
) {
  const fr = await getFrBySymbol(timeframe, symbol);
  kline.forEach((k: KlineObj) => {
    fr.forEach((el) => {
      if (k.closeTime == el.closeTime) {
        k.fr = el;
      }
    });
  });
  return kline;
}
