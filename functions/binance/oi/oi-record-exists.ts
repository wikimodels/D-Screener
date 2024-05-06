import { KlineObj } from "../../../models/binance/kline.ts";
import { OpenInterest } from "../../../models/binance/oi.ts";

export async function oiRecordExists(obj: KlineObj, kvNamespace: string) {
  const kv = await Deno.openKv(kvNamespace);
  const record: Deno.KvEntryMaybe<OpenInterest> = await kv.get<OpenInterest>([
    "Oi",
    obj.symbol,
    obj.closeTime,
  ]);
  if (record.value) {
    return true;
  }
  return false;
}
