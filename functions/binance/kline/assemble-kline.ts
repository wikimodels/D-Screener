import { getAllLiquidations } from "../force-order/get-all-liquidations.ts";
import { getAllFundingRates } from "../mark-price-update/get-all-fr.ts";
import { getAllOpenInterest } from "../oi/get-all-oi.ts";
import { getAllKline } from "./get-all-kline.ts";

export async function assembleKline(timeframe: string) {
  const kline = await getAllKline(timeframe);
  const fr = await getAllFundingRates(timeframe);
  const oi = await getAllOpenInterest(timeframe);
  const liq = await getAllLiquidations(timeframe);
  kline.forEach((k) => {
    fr.forEach((f) => {
      if (k.closeTime == f.closeTime) {
        k.fr = f;
      }
    });
  });
  kline.forEach((k) => {
    oi.forEach((o) => {
      if (k.closeTime == o.closeTime) {
        k.oi = o;
      }
    });
  });
  kline.forEach((k) => {
    liq.forEach((l) => {
      if (k.closeTime == l.closeTime) {
        k.liquidations = l;
      }
    });
  });
  return kline;
}