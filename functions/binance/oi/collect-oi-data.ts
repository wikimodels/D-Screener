import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { generateBinanceSignature } from "../../utils/generate-binance-signature.ts";
import { OpenInterest } from "../../../models/binance/oi.ts";
import { UnixToTime } from "../../utils/time-converter.ts";

const env = await load();

export async function collectOiData(symbol: string, period: string) {
  const signature = await generateBinanceSignature(
    symbol,
    env["BINANCE_SECRET_KEY"]
  );
  const url = new URL(env["BINANCE_OI"]);
  url.searchParams.append("symbol", symbol);
  url.searchParams.append("period", period);
  url.searchParams.append("limit", "1");
  url.searchParams.append("signature", signature);

  const headers = new Headers({
    "X-MBX-APIKEY": env["BINANCE_API_KEY"],
    "Content-Type": "application/json",
  });

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data: OpenInterest[] = await response.json();
    console.log("OI", UnixToTime(data[0].timestamp), data[0].symbol);
    console.log("OI Length", data.length);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
