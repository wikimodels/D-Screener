import { PublicTradeRecord } from "../../models/bybit/public-trade-record.ts";

export async function getPublicTradeBySymbol(
  timeframe: string,
  symbol: string
): Promise<PublicTradeRecord[]> {
  const kv = await Deno.openKv();
  const entries = await kv.list<PublicTradeRecord>({
    prefix: [`Pt_${timeframe}`],
  });
  let array = [];
  for await (const res of entries) {
    array.push(res.value as PublicTradeRecord);
  }
  array = array.filter((el) => el.symbol == symbol);
  return array;
}
