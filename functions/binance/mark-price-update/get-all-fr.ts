import { FundingRate } from "../../../models/binance/funding-rate.ts";
import { UnixToTime } from "../../utils/time-converter.ts";

export async function getAllFundingRates(
  timeframe: string
): Promise<FundingRate[]> {
  const kv = await Deno.openKv();
  const entries = await kv.list<FundingRate>({ prefix: [`Fr_${timeframe}`] });
  const array = [];
  for await (const res of entries) {
    array.push(res.value as FundingRate);
  }
  console.log("FR entries", array);
  return array;
}
