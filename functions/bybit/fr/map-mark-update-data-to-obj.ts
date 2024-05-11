import { FundingRate } from "../../../models/binance/funding-rate.ts";

export function mapFundingRateDataToObj(
  data: { symbol: string; fundingRate: string; fundingRateTimestamp: string },
  closeTime: number = 0
): FundingRate {
  const obj: FundingRate = {
    symbol: data.symbol,
    fr: Number(data.fundingRate),
    nextFundingTime: Number(data.fundingRateTimestamp),
    closeTime: closeTime,
  };
  return obj;
}
