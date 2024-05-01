import { OpenInterestHist } from "../../../models/binance/oi.ts";
import { candlesRepo } from "../candles-repo/create-candles-repo.ts";

export function insertOiDataIntoRepo(data: OpenInterestHist[]) {
  candlesRepo.forEach((c) => {
    data.forEach((d) => {
      if (c.symbol == d.symbol) {
        c.data.forEach((e) => {
          if (e.closeTime > d.timestamp - 1000 && e.openTime < d.timestamp) {
            (e.oi.isUpdated = true),
              (e.oi.oiValue = d.sumOpenInterest),
              (e.oi.symbol = c.symbol),
              (e.oi.timestamp = d.timestamp);
          }
        });
      }
    });
  });
}
