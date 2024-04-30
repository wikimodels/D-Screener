// deno-lint-ignore-file no-explicit-any
import { CandlesRepo } from "../../../models/binance/candles-repo.ts";
import { getAllCoins } from "../../utils/get-coins.ts";

export const candlesRepo = await createCandlesRepo("15m");

export async function createCandlesRepo(timeframe: string) {
  const coins = await getAllCoins();
  const repo: CandlesRepo[] = [];
  coins.forEach((c) => {
    repo.push({
      symbol: c.symbol,
      tf: timeframe,
      data: [],
    });
  });
  return repo;
}
