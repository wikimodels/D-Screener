import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { OpenInterestData } from "../../../models/binance/oi.ts";
import { UnixToTime } from "../../utils/time-converter.ts";
import { insertOiDataIntoObj } from "./insert-oi-data-into-obj.ts";
import { mapOiDataToObj } from "./map-oi-data-to-obj.ts";

const env = await load();

export async function collectOiData(
  symbol: string,
  openTime: number,
  closeTime: number
) {
  const url = new URL(env["BINANCE_OI"]);
  url.searchParams.append("symbol", symbol.toLocaleLowerCase());

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data: OpenInterestData = await response.json();
    const obj = mapOiDataToObj(data);
    insertOiDataIntoObj(obj, openTime, closeTime);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
