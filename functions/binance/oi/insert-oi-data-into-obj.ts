import { OpenInterest } from "../../../models/binance/oi.ts";
import { UnixToTime } from "../../utils/time-converter.ts";
import { candlesRepo } from "../candles-repo/create-candles-repo.ts";

export function insertOiDataIntoObj(
  data: OpenInterest,
  openTime: number,
  closeTime: number
) {
  candlesRepo.forEach((c) => {
    if (c.symbol == data.symbol) {
      c.data.forEach((d) => {
        if (d.openTime == openTime && d.closeTime == closeTime) {
          d.oi.timestamp = Number(data.timestamp);
          d.oi.oiValue = Number(data.oiValue);
          d.oi.isUpdated = true;
        }
      });
    }
  });
}
