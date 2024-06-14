import { cleanKv } from "./functions/kv-utils/kv-clean.ts";
import { getAllCoins } from "./functions/utils/get-all-coins.ts";

import { biMain } from "./bi-main.ts";
import { byMain } from "./by-main.ts";

export async function main(timeframe: string) {
  await cleanKv()
    .then(() => {
      console.log(`%cKVDB ---> cleaned`, "color: yellow");
    })
    .catch(console.error);

  const byCoins = (await getAllCoins()).filter((c) => c.exchange == "by");
  const biCoins = (await getAllCoins()).filter(
    (c) => c.exchange == "bi" || c.exchange == "biby"
  );
   
  biMain(timeframe, biCoins);
  byMain(timeframe, byCoins);
}
