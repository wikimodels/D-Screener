// deno-lint-ignore-file no-explicit-any
import { cleanKv } from "./functions/kv-utils/kv-clean.ts";
import { getAllCoins } from "./functions/utils/get-all-coins.ts";

import { biMain } from "./bi-main.ts";
import { byMain } from "./by-main.ts";
import { Coin } from "./models/shared/coin.ts";

export async function main(timeframe: string) {
  await cleanKv()
    .then(() => {
      console.log(`%cKVDB ---> cleaned`, "color: yellow");
    })
    .catch(console.error);

  const coins = await getAllCoins();
  const byCoins = coins.filter((c) => c.exchange == "by");
  const biCoins = coins.filter(
    (c: Coin) => c.exchange == "bi" || c.exchange == "biby"
  );
  const biCoinsI = biCoins.slice(0, 200);
  const biCoinsII = biCoins.slice(200, biCoins.length + 1).slice(0, 4);
  console.log("total", coins.length);
  console.log("by", byCoins.length);
  console.log("biI", biCoinsI.length);
  console.log("biII", biCoinsII.length);
  //biMain(timeframe, biCoinsI);
  biMain(timeframe, biCoinsII);
  //byMain(timeframe, byCoins);
}
