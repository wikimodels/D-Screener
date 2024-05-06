import { KlineObj } from "../../../models/binance/kline.ts";

export async function getAllKline(kvNamespace: string): Promise<KlineObj[]> {
  const kv = await Deno.openKv(kvNamespace);
  const entries = await kv.list<KlineObj>({ prefix: ["Kline"] });
  const array = [];
  for await (const res of entries) {
    array.push(res.value as KlineObj);
  }

  return array;
}