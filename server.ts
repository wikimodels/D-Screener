// deno-lint-ignore-file
import express from "npm:express@4.18.2";
import fetchBinanceSpotKlineData from "./functions/fetch-binance-kline.ts";

const app = express();

app.get("/", async (req: any, res: any) => {
  try {
    const data = await fetchBinanceSpotKlineData("ATOMUSDT", "1h", 4);
    res.send(data);
  } catch (e) {
    console.log(e);
  }
});

app.listen(8000, () => {
  console.log("Server is running...");
});
