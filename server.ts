// deno-lint-ignore-file
import express from "npm:express@4.18.2";
import fetchBinanceSpotKlineData from "./functions/binance/collect-kline-data.ts";
import collectBinanceKlineData from "./functions/binance/collect-kline-data.ts";
import collectLiquidationData from "./collect-liquidation-data.ts";
const app = express();

app.get("/", async (req: any, res: any) => {
  try {
    const data = await collectBinanceKlineData("1h", 200);
    res.send(data);
  } catch (e) {
    console.log(e);
  }
});

app.listen(8000, async () => {
  console.log("Server is running...");
});
collectLiquidationData();
