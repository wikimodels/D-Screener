import { KlineObj } from "../../../models/shared/kline.ts";

export async function getKlineBySymbol(
  timeframe: string,
  symbol: string
): Promise<KlineObj[]> {
  const kv = await Deno.openKv();
  const entries = await kv.list<KlineObj>({
    prefix: [`Kline_${timeframe}`],
  });
  let array = [];
  for await (const res of entries) {
    array.push(res.value as KlineObj);
  }
  array = array.filter((el) => el.symbol == symbol);
  return array;
}
