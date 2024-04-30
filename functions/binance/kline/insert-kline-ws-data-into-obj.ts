import { KlineData, KlineObj } from "../../../models/binance/kline.ts";
import { UnixToTime } from "../../utils/time-converter.ts";
import { candlesRepo } from "../candles-repo/create-candles-repo.ts";

export function insertKlineWsDataIntoObj(data: KlineData) {
  candlesRepo.forEach((c) => {
    if (c.symbol == data.s) {
      c.data.forEach((d) => {
        console.log(`${data.s} is being updated...`);
        if (d.openTime == data.k.t && d.closeTime == data.k.T) {
          d.close = Number(data.k.c);
          d.open = Number(data.k.o);
          d.high = Number(data.k.h);
          d.low = Number(data.k.l);
          d.close = Number(data.k.c);
          d.baseVolume = Number(data.k.v);
          d.quoteVolume = Number(data.k.q);
          d.numberOfTrades = Number(data.k.n);
          d.isCandleClosed = data.k.x;
          d.takerBuyBaseVolume = Number(data.k.V);
          d.takerBuyQuoteVolume = Number(data.k.Q);
          d.takerSellBaseVolume = Number(data.k.v) - Number(data.k.V);
          d.takerSellQuoteVolume = Number(data.k.q) - Number(data.k.Q);
          d.hlc3 = (Number(data.k.o) + Number(data.k.l) + Number(data.k.c)) / 3;
        }
      });
    }
  });
}
