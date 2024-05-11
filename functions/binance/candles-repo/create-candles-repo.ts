import * as _ from "https://cdn.skypack.dev/lodash";

import { CandlesRepo } from "../../../models/binance/candles-repo.ts";
import { getAllCoins } from "../../utils/get-coins.ts";
import { getLiqBySymbol } from "../force-order/get-liq-by-symbol.ts";
import { getKlineBySymbol } from "../kline/get-kline-by-symbol.ts";
import { getFrBySymbol } from "../mark-price-update/get-fr-by-symbol.ts";
import { getOiBySymbol } from "../oi/get-oi-by-symbol.ts";
import { ConsoleColors, print } from "../../utils/print.ts";
import { getPublicTradeBySymbol } from "../../bybit/public-trade/get-public-trade-by-symbol.ts";

export async function createCandlesRepo(
  timeframe: string
): Promise<CandlesRepo[]> {
  const coins = await getAllCoins();
  const candleRepo: CandlesRepo[] = [];
  for (let i = 0; i < coins.length; i++) {
    const repo: CandlesRepo = {
      symbol: coins[i].symbol,
      tf: timeframe,
      data: [],
    };
    let kline = await getKlineBySymbol(timeframe, coins[i].symbol);

    const fr = await getFrBySymbol(timeframe, coins[i].symbol);
    const oi = await getOiBySymbol(timeframe, coins[i].symbol);
    const liq = await getLiqBySymbol(timeframe, coins[i].symbol);
    const pt = await getPublicTradeBySymbol(timeframe, coins[i].symbol);
    kline.forEach((k) => {
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
        if (k.closeTime == el.closeTime) {
          k.liquidations = el;
        }
      });
      pt.forEach((el) => {
        if (k.closeTime == el.closeTime) {
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
    print(
      ConsoleColors.magenta,
      `KVDB --> ${kline[0].symbol} loaded ${kline.length} `
    );
    candleRepo.push(repo);
  }
  print(
    ConsoleColors.magenta,
    `KVDB --> totally loaded ${candleRepo.length} coins`
  );
  return candleRepo;
}
