import * as _ from "https://cdn.skypack.dev/lodash";

import { CandlesRepo } from "../../../models/binance/candles-repo.ts";
import { getAllCoins } from "../../utils/get-coins.ts";
import { getLiqBySymbol } from "../../binance/force-order/get-liq-by-symbol.ts";
import { getKlineBySymbol } from "../../binance/kline/get-kline-by-symbol.ts";
import { getFrBySymbol } from "../../binance/mark-price-update/get-fr-by-symbol.ts";
import { getOiBySymbol } from "../../binance/oi/get-oi-by-symbol.ts";
import { ConsoleColors, print } from "../../utils/print.ts";
import { getPublicTradeBySymbol } from "../../bybit/public-trade/get-public-trade-by-symbol.ts";
import { KlineObj } from "../../../models/shared/kline.ts";

export async function createCandlesRepo(
  timeframe: string
): Promise<CandlesRepo[]> {
  const coins = await getAllCoins();
  console.log("CO_COs", coins);
  const candleRepo: CandlesRepo[] = [];
  for (let i = 0; i < coins.length; i++) {
    const repo: CandlesRepo = {
      symbol: coins[i].symbol,
      tf: timeframe,
      data: [],
    };
    let kline = await getKlineBySymbol(timeframe, coins[i].symbol);
    console.log(kline);
    const fr = await getFrBySymbol(timeframe, coins[i].symbol);
    const oi = await getOiBySymbol(timeframe, coins[i].symbol);
    const liq = await getLiqBySymbol(timeframe, coins[i].symbol);
    const pt = await getPublicTradeBySymbol(timeframe, coins[i].symbol);
    kline.forEach((k: KlineObj) => {
      fr.forEach((el) => {
        if (k.closeTime == el.closeTime) {
          k.fr = el;
        }
      });
      oi.forEach((el) => {
        if (k.closeTime == el.closeTime) {
          k.oi = el;
        }
      });
      liq.forEach((el) => {
        if (k.closeTime >= el.closeTime && el.closeTime > k.openTime) {
          k.liquidations = el;
        }
      });
      pt.forEach((el) => {
        if (k.closeTime >= el.closeTime && el.closeTime > k.openTime) {
          k.numberOfTrades = el.numberOfTrades;
          k.takerBuyBaseVolume = el.takerBuyBaseVolume;
          k.takerSellBaseVolume = el.takerSellBaseVolume;
          k.takerBuyQuoteVolume = el.takerBuyQuoteVolume;
          k.takerSellQuoteVolume = el.takerSellQuoteVolume;
        }
      });
    });
    kline = _.orderBy(kline, "openTime");
    repo.data = [...kline];
    if (kline[0]) {
      print(
        ConsoleColors.magenta,
        `KVDB --> ${kline[0].symbol} loaded ${kline.length} `
      );
    }
    candleRepo.push(repo);
  }
  print(
    ConsoleColors.magenta,
    `KVDB --> totally loaded ${candleRepo.length} coins`
  );
  return candleRepo;
}
