import { OpenInterest } from "../../../models/binance/oi.ts";

export async function getOiBySymbol(
  timeframe: string,
  symbol: string
): Promise<OpenInterest[]> {
  const kv = await Deno.openKv(timeframe);
  const entries = await kv.list<OpenInterest>({ prefix: [`Oi_${timeframe}`] });
  let array = [];
  for await (const res of entries) {
    array.push(res.value as OpenInterest);
  }
  array = array.filter((el) => el.symbol == symbol);
  return array;
}
