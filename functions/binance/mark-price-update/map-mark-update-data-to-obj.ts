import { MarkPriceUpdateObj } from "../../../models/binance/mark-price-update.ts";
import { MarkPriceUpdateData } from "../../../models/binance/mark-price-update.ts";

export function mapMarkUpdateDataToObj(
  data: MarkPriceUpdateData
): MarkPriceUpdateObj {
  const obj: MarkPriceUpdateObj = {
    eventType: data.e,
    eventTime: data.E,
    symbol: data.s,
    markPrice: data.p,
    indexPrice: data.i,
    estimatedPrice: data.P,
    fundingRate: data.r,
    nextFundingTime: data.T,
  };
  return obj;
}
