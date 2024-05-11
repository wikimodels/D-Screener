import { KlineObj } from "../shared/kline.ts";

export interface CandlesRepo {
  symbol: string;
  tf: string;
  data: KlineObj[];
}
