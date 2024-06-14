import { TimeframeControl } from "../../../models/shared/timeframe-control.ts";
import { getAllCoins } from "../../utils/get-all-coins.ts";

export async function createTimeframeRepo(): Promise<TimeframeControl[]> {
  let repo: TimeframeControl[];
  try {
    repo = (await getAllCoins()).map((c) => {
      return {
        symbol: c.symbol,
        isClosed: false,
        openTime: 0,
        closeTime: 0,
      };
    });
    return repo;
  } catch (error) {
    console.log(error);
  }
  return [];
}
