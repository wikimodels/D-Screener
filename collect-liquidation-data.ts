// deno-lint-ignore-file no-explicit-any no-explicit-any
const env = await load();
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";

import * as _ from "https://cdn.skypack.dev/lodash";

import { LiquidationRecord } from "./models/binance/force-order.ts";
import {
  LiquidationData,
  LiquidationObj,
} from "./models/binance/force-order.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import loadCSV from "./functions/utils/csv/load-csv.ts";
const kv = await Deno.openKv();

async function collectLiquidationData() {
  const coins: any[] = await getBinanceCoins();
  let liqCounter = createLiquidationCounter(coins);

  //SET LIQUIDATION KVDB
  await resetLiquidationKvDb(coins);

  setInterval(async () => {
    const copy = [...liqCounter];
    liqCounter = createLiquidationCounter(coins);
    await updateLiquidationKvDb(copy);
    console.log("Liquidations updated");
  }, 60 * 1000);

  const ws: WebSocketClient = new StandardWebSocketClient(
    env["BINANCE_ALL_LIQUIDATIONS"]
  );
  ws.on("open", function () {
    console.log("----- LIQUIDATIONS WS CONNECTED -----");
  });
  ws.on("message", function (message: any) {
    const data: LiquidationData = JSON.parse(message.data);
    const obj = getLiquidationObj(data);
    if (coins.find((c) => c.symbol == obj.symbol)) {
      liqCounter = updateLiquidationCounter(liqCounter, obj);
      console.log(obj.symbol, obj.side, obj.liqSum);
    }
  });

  ws.on("error", function (error: Error) {
    console.log("ERROR MESSAGE", error.message);
    console.log(error.cause);
    console.log(error.stack);
  });
}

function getLiquidationObj(data: LiquidationData): LiquidationObj {
  const obj: LiquidationObj = {
    timestamp: data.o.T,
    symbol: data.o.s,
    side: data.o.S,
    liqSum: data.o.ap * data.o.l,
  };
  return obj;
}

export async function getBinanceCoins() {
  let coins: any[] = await loadCSV(env["COINS"]);
  coins = coins.filter((c) => c.exchange == "bi" || c.exchange == "biby");
  return coins;
}

export async function resetLiquidationKvDb(coins: any[]) {
  console.log("RESET LIQKVDB");
  for (const coin of coins) {
    await kv.set(["Liquidation", coin.symbol, "BUY"], 0);
    await kv.set(["Liquidation", coin.symbol, "SELL"], 0);
  }
}

function createLiquidationCounter(array: any[]) {
  const liqCounter = array.reduce(
    (acc: LiquidationRecord[], cur: LiquidationObj) => {
      const buyObj: LiquidationRecord = {
        symbol: cur.symbol,
        side: "BUY",
        liqSum: 0,
      };
      const sellObj: LiquidationRecord = {
        symbol: cur.symbol,
        side: "SELL",
        liqSum: 0,
      };
      acc.push(buyObj);
      acc.push(sellObj);
      return acc;
    },
    []
  );
  return liqCounter;
}

function updateLiquidationCounter(
  array: LiquidationRecord[],
  liqObj: LiquidationObj
): LiquidationRecord[] {
  const _array = array.reduce(
    (acc: LiquidationRecord[], cur: LiquidationRecord) => {
      if (cur.symbol == liqObj.symbol && cur.side == liqObj.side) {
        cur.liqSum = Number(cur.liqSum) + Number(liqObj.liqSum);
      }
      acc.push(cur);
      return acc;
    },
    []
  );
  return _array;
}

async function updateLiquidationKvDb(array: LiquidationRecord[]) {
  for (const record of array) {
    const dbRecord = await kv.get(["Liquidation", record.symbol, record.side]);
    const value = Number(dbRecord.value) + Number(record.liqSum);
    await kv.set(["Liquidation", record.symbol, record.side], value);
  }
}

export async function getLiquidationReport(coins: any[]) {
  console.log("GetLiqReport===");
  const report = [];
  for (const coin of coins) {
    const buyRes = await kv.get(["Liquidation", coin.symbol, "BUY"]);
    const sellRes = await kv.get(["Liquidation", coin.symbol, "SELL"]);
    const buyObj = {
      symbol: coin.symbol,
      side: "BUY",
      liqSum: Number(buyRes.value),
    };
    const sellObj = {
      symbol: coin.symbol,
      side: "SELL",
      liqSum: Number(sellRes.value),
    };
    report.push(buyObj);
    report.push(sellObj);
  }
  return report;
}

export default collectLiquidationData;
