import { KlineData, KlineObj } from "../../../models/binance/kline.ts";
import { UnixToTime } from "../../utils/time-converter.ts";
import { candlesRepo } from "../candles-repo/create-candles-repo.ts";

export function createKlineObj(data: KlineData) {
  const symbol = data.s;
  const openTime = data.k.t;
  const closeTime = data.k.T;
  const symbolExists = candlesRepo.find((c) => (c.symbol = symbol));

  if (!symbolExists) {
    throw Error(`${symbol} doesn't exists in CandlesRepo`);
  }

  const klineObjExists = symbolExists.data.find(
    (d) => d.closeTime == closeTime && d.openTime == openTime
  );
  if (!klineObjExists) {
    const obj: KlineObj = {
      symbol: symbol,
      openTime: openTime,
      closeTime: closeTime,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
      isHammer: false,
      isPinbar: false,
      baseVolume: 0,
      quoteVolume: 0,
      numberOfTrades: 0,
      isCandleClosed: false,
      takerBuyBaseVolume: 0,
      takerBuyQuoteVolume: 0,
      takerSellBaseVolume: 0,
      takerSellQuoteVolume: 0,
      hlc3: 0,
      liquidations: {
        buy: {
          liqSum: 0,
          counter: 0,
        },
        sell: {
          liqSum: 0,
          counter: 0,
        },
      },
      fr: {
        fundingRate: 0,
        nextFundingTime: 0,
      },
      oi: {
        sumOpenInterest: 0,
        sumOpenInterestValue: 0,
      },
      vwap: { vwapValue: 0, vwap1stDevUp: 0, vwap1stDevDown: 0 },
    };

    candlesRepo.forEach((c) => {
      if (c.symbol == symbol) {
        c.data.push(obj);
      }
      console.log("New Obj added");
      console.log(
        `Symbol ${symbol} OpenTime ${UnixToTime(
          openTime
        )} CloseTime ${UnixToTime(closeTime)} `
      );
    });
  } else {
    console.log(`Obj ${symbol} alredy in Repo`);
  }
}
