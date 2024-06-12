// deno-lint-ignore-file no-explicit-any
import * as _ from "https://cdn.skypack.dev/lodash";
import { CandlesRepo } from "../../models/binance/candles-repo.ts";
import { createReportBySymbol } from "./create-report-by-symbol.ts";

export async function createReport(
  timeframe: string,
  coins: any[]
): Promise<CandlesRepo[]> {
  const candleRepo: CandlesRepo[] = [];
  for (let i = 0; i < coins.length; i++) {
    const repo = await createReportBySymbol(timeframe, coins[i].symbol);
    candleRepo.push(repo);
  }
  return candleRepo;
}
