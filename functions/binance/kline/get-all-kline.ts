import { KlineObj } from "../../../models/binance/kline.ts";

export async function getAllKline(timeframe: string): Promise<KlineObj[]> {
  const kv = await Deno.openKv();
  const entries = await kv.list<KlineObj>({ prefix: [`Kline_${timeframe}`] });
  const array = [];
  for await (const res of entries) {
    array.push(res.value as KlineObj);
  }

  return array;
}
