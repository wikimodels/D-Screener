// deno-lint-ignore-file no-explicit-any

import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { BinanceKlineObj } from "../../models/binance/kline-obj.ts";
import loadCSV from "../utils/csv/load-csv.ts";

const env = await load();

async function collectBinanceKlineData(interval: string, startTime: number) {
  const coins = await loadCSV("./assets/data/coins.csv");
  const array = [];

  for await (const coin of coins) {
    const data = await fetchBinanceSpotKlineData(
      coin.symbol,
      interval,
      startTime
    );
    array.push({
      symbol: coin.symbol,
      data: data,
    });
  }
  return array;
}

async function fetchBinanceSpotKlineData(
  symbol: string,
  interval: string,
  startTime: number
): Promise<any> {
  const url = new URL(env["BINANCE_SPOT_KLINE"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("interval", interval);
  url.searchParams.append("endTime", new Date().getTime().toString());
  url.searchParams.append(
    "startTime",
    (new Date().getTime() - startTime * 60 * 60 * 1000).toString()
  );

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  const data = await response.json();
  const klineData = data.map((d: any[]) => convertToKlineDataObj(d));
  return klineData;
}

function convertToKlineDataObj(arr: any[]): BinanceKlineObj {
  const obj: BinanceKlineObj = {
    openTime: arr[0] / 1000,
    open: parseFloat(arr[1]),
    high: parseFloat(arr[2]),
    low: parseFloat(arr[3]),
    close: parseFloat(arr[4]),
    volume: parseFloat(arr[5]),
    closeTime: arr[6] / 1000,
    quoteVolume: parseFloat(arr[7]),
    numberOfTrades: arr[8],
    takerBuyBaseVolume: parseFloat(arr[9]),
    takerBuyQuoteVolume: parseFloat(arr[10]),
    takerSellBaseVolume: parseFloat(arr[5]) - parseFloat(arr[9]),
    takerSellQuoteVolume: parseFloat(arr[7]) - parseFloat(arr[10]),
    hlc3: (parseFloat(arr[2]) + parseFloat(arr[3]) + parseFloat(arr[4])) / 3,
  };
  return obj;
}

export default collectBinanceKlineData;
