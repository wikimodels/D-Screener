import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { loadCSV } from "./csv/load-csv.ts";
import { Coin } from "../../models/shared/coin.ts";
const env = await load();

export async function getAllCoins() {
  const data: Coin[] = await loadCSV(env["COINS"]);
  return data;
}
