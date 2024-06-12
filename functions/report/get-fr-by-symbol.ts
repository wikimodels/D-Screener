import { FundingRate } from "../../models/binance/funding-rate.ts";

export async function getFrBySymbol(
  timeframe: string,
  symbol: string
): Promise<FundingRate[]> {
  const kv = await Deno.openKv();
  const entries = await kv.list<FundingRate>({ prefix: [`Fr_${timeframe}`] });
  let array = [];
  for await (const res of entries) {
    array.push(res.value as FundingRate);
  }
  array = array.filter((el) => el.symbol == symbol);
  return array;
}
