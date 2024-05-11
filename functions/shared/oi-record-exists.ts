import { KlineObj } from "../../models/shared/kline.ts";
import { OpenInterest } from "../../models/shared/oi.ts";

export async function oiRecordExists(obj: KlineObj, timeframe: string) {
  const kv = await Deno.openKv();
  const record: Deno.KvEntryMaybe<OpenInterest> = await kv.get<OpenInterest>([
    `Oi_${timeframe}`,
    obj.symbol,
    obj.closeTime,
  ]);
  if (record.value) {
    return true;
  }
  return false;
}