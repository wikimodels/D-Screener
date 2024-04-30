// deno-lint-ignore-file
import express from "npm:express@4.18.2";

import collectLiquidationData, {
  getBinanceCoins,
  getLiquidationReport,
  resetLiquidationKvDb,
} from "./collect-liquidation-data.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

const env = await load();
const app = express();
const kv = await Deno.openKv();
const binanceCoins = await getBinanceCoins();
app.get("/", async (req: any, res: any) => {
  try {
    //const data = await collectBinanceKlineData("1h", 200);
    const liquidationData = await getLiquidationReport(binanceCoins);
    const liquidationDataCopy = [...liquidationData];
    await resetLiquidationKvDb(binanceCoins);
    await res.send(liquidationDataCopy);
  } catch (e) {
    console.log(e);
  }
});
app.get("/fr", async (req: any, res: any) => {
  try {
    await res.send("fuck");
  } catch (e) {
    console.log(e);
  }
});
app.listen(8000, async () => {
  console.log("Server is running...");
});
collectLiquidationData();
