import { cleanKv } from "./functions/kv-utils/kv-clean.ts";
import { getAllCoins } from "./functions/utils/get-coins.ts";
import { print, ConsoleColors } from "./functions/utils/print.ts";

import { biMain } from "./bi-main.ts";
import { byMain } from "./by-main.ts";

export async function main(timeframe: string) {
  await cleanKv()
    .then(() => {
      print(ConsoleColors.yellow, "KVDB ---> cleaned");
    })
    .catch(console.error);

  const byCoins = (await getAllCoins()).filter((c) => c.exchange == "by");
  const biCoins = (await getAllCoins()).filter(
    (c) => c.exchange == "bi" || c.exchange == "biby"
  );

  biMain(timeframe, biCoins);
  byMain(timeframe, byCoins);
}
