import { OpenInterest } from "../../../models/binance/oi.ts";

export async function getAllOpenInterest(
  timeframe: string
): Promise<OpenInterest[]> {
  const kv = await Deno.openKv(timeframe);
  const entries = await kv.list<OpenInterest>({ prefix: [`Oi_${timeframe}`] });
  const array = [];
  for await (const res of entries) {
    array.push(res.value as OpenInterest);
  }
  return array;
}
