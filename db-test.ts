import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
const env = await load();

export async function dbTest() {
  const body = JSON.stringify({
    collection: "Liquidations",
    database: "Longs",
    dataSource: "Binance",
    projection: {
      symbol: 1,
    },
  });
  const resp = await fetch(
    "https://eu-central-1.aws.data.mongodb-api.com/app/data-jfidxqj/endpoint/data/v1/action/find",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": env["MONGODB_KEY"],
      },
      body,
    }
  );
  return await resp.json();
}
