import { KlineObj } from "./kline.ts";

export interface CandlesRepo {
  symbol: string;
  tf: string;
  data: KlineObj[];
}
