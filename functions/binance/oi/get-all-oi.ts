import { OpenInterest } from "../../../models/binance/oi.ts";

export async function getAllOpenInterest(
  kvNamespace: string
): Promise<OpenInterest[]> {
  const kv = await Deno.openKv(kvNamespace);
  const entries = await kv.list<OpenInterest>({ prefix: ["Oi"] });
  const array = [];
  for await (const res of entries) {
    array.push(res.value as OpenInterest);
  }
  console.log("Oi entries", array);
  return array;
}
