import { KlineObj } from "../../../models/binance/kline.ts";
import { LiquidationRecord } from "../../../models/binance/liquidation-record.ts";

export async function getLiqBySymbol(
  timeframe: string,
  symbol: string
): Promise<LiquidationRecord[]> {
  const kv = await Deno.openKv();
  const entries = await kv.list<LiquidationRecord>({
    prefix: [`Liq_${timeframe}`],
  });
  let array = [];
  for await (const res of entries) {
    array.push(res.value as LiquidationRecord);
  }
  array = array.filter((el) => el.symbol == symbol);
  return array;
}
