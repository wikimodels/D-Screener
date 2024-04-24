// deno-lint-ignore-file
import express from "npm:express@4.18.2";
import fetchBinanceSpotKlineData from "./functions/binance/collect-kline-data.ts";
import collectBinanceKlineData from "./functions/binance/collect-kline-data.ts";
import collectLiquidationData, {
  readShit,
} from "./collect-liquidation-data.ts";
import loadCSV from "./functions/utils/load-csv.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";

const env = await load();
const app = express();
const kv = await Deno.openKv();
const prefs = {
  username: "ada",
  theme: "dark",
  language: "en-US",
};

const result = await kv.set(["preferences", "ada"], prefs);
app.get("/", async (req: any, res: any) => {
  try {
    //const data = await collectBinanceKlineData("1h", 200);
    const liquidationData = await loadCSV(env["LIQUIDATIONS_BOOK"]);
    const shit = await readShit(kv);
    res.send(shit);
  } catch (e) {
    console.log(e);
  }
});

app.listen(8000, async () => {
  console.log("Server is running...");
});
//collectLiquidationData();
