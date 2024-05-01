// deno-lint-ignore-file no-explicit-any
import { CandlesRepo } from "../../../models/binance/candles-repo.ts";
import { getAllCoins } from "../../utils/get-coins.ts";
import { SYNQ } from "../timeframe-control/synq.ts";

export const candlesRepo = await createCandlesRepo();

export async function createCandlesRepo() {
  const timeframe = SYNQ.createCandlesRepo.timeframe;
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
