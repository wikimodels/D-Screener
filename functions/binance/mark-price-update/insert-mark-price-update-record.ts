import { candlesRepo } from "../../shared/candles-repo/create-candles-repo.ts";
import { TimeframeControl } from "../../../models/shared/timeframe-control.ts";
import { MarkPriceUpdateObj } from "../../../models/binance/mark-price-update.ts";
export function insertMarkPriceUpdateRecord(
  tfControl: TimeframeControl,
  record: MarkPriceUpdateObj
) {
  candlesRepo.forEach((r) => {
    if (r.symbol == record.symbol) {
      r.data.forEach((d) => {
        if (
          d.openTime == tfControl.openTime &&
          d.closeTime == tfControl.closeTime
        ) {
          d.fr.fundingRate = record.fundingRate;
          d.fr.nextFundingTime = record.nextFundingTime;
        }
      });
    }
  });
}
