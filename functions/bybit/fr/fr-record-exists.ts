import { FundingRate } from "../../../models/binance/funding-rate.ts";
import { KlineObj } from "../../../models/shared/kline.ts";

export async function frRecordExists(obj: KlineObj, timeframe: string) {
  const kv = await Deno.openKv();
  const record: Deno.KvEntryMaybe<FundingRate> = await kv.get<FundingRate>([
    `Fr_${timeframe}`,
    obj.symbol,
    obj.closeTime,
  ]);
  if (record.value) {
    return true;
  }
  return false;
}
