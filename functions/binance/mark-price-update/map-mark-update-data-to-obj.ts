import { FundingRate } from "../../../models/binance/funding-rate.ts";
import { MarkPriceUpdateData } from "../../../models/binance/mark-price-update.ts";

export function mapMarkUpdateDataToObj(
  data: MarkPriceUpdateData,
  closeTime: number = 0
): FundingRate {
  const obj: FundingRate = {
    symbol: data.s,
    fr: data.r,
    nextFundingTime: data.T,
    closeTime: closeTime,
  };
  return obj;
}
