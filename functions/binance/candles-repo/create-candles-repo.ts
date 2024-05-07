import { datetime } from "https://deno.land/x/ptera@v1.0.2/mod.ts";
// deno-lint-ignore-file no-explicit-any
import { CandlesRepo } from "../../../models/binance/candles-repo.ts";
import { getAllCoins } from "../../utils/get-coins.ts";
import { getLiqBySymbol } from "../force-order/get-liq-by-symbol.ts";
import { getKlineBySymbol } from "../kline/get-kline-by-symbol.ts";
import { getFrBySymbol } from "../mark-price-update/get-fr-by-symbol.ts";
import { getOiBySymbol } from "../oi/get-oi-by-symbol.ts";

export async function createCandlesRepo(timeframe: string) {
  const coins = await getAllCoins();
  const candleRepo: CandlesRepo[] = [];
  for (let i = 0; i < coins.length; i++) {
    const repo: CandlesRepo = {
      symbol: coins[i].symbol,
      tf: timeframe,
      data: [],
    };
    const kline = await getKlineBySymbol(timeframe, coins[i].symbol);
    const fr = await getFrBySymbol(timeframe, coins[i].symbol);
    const oi = await getOiBySymbol(timeframe, coins[i].symbol);
    const liq = await getLiqBySymbol(timeframe, coins[i].symbol);
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
    });
    repo.data = [...kline];
    candleRepo.push(repo);
  }

  return candleRepo;
}
