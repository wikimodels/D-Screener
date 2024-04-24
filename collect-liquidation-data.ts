// deno-lint-ignore-file no-explicit-any no-explicit-any
const env = await load();
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";

import * as _ from "https://cdn.skypack.dev/lodash";

import { LiquidationRecord } from "./models/binance/liquidation-obj.ts";
import {
  LiquidationData,
  LiquidationObj,
} from "./models/binance/liquidation-obj.ts";
import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import loadCSV from "./functions/utils/load-csv.ts";
import writeToCSV from "./functions/utils/write-to-csv.ts";

async function collectLiquidationData() {
  const coins: any[] = await loadCSV("./assets/data/coins.csv");
  let liqCounter = createLiquidationCounter(coins);

  //CREATE LIQUIDATION BOOK
  await writeToCSV(env["LIQUIDATIONS_BOOK"], liqCounter);

  setInterval(async () => {
    const copy = [...liqCounter];
    liqCounter = createLiquidationCounter(coins);
    await updateLiquidationBook(copy, env["LIQUIDATIONS_BOOK"]);
    console.log("Liquidations updated");
  }, 60 * 1000);
  const ws: WebSocketClient = new StandardWebSocketClient(
    env["BINANCE_ALL_LIQUIDATIONS"]
  );
  ws.on("open", function () {
    console.log("ws connected!");
  });
  ws.on("message", function (message: any) {
    const data: LiquidationData = JSON.parse(message.data);
    const obj = getLiquidationObj(data);
    if (coins.find((c) => c.symbol == obj.symbol)) {
      liqCounter = updateLiquidationCounter(liqCounter, obj);
      console.log(obj.symbol, obj.side, obj.liqSum);
    }
  });
  ws.on("error", function (error: any) {
    console.log(error);
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

async function updateLiquidationBook(
  array: LiquidationRecord[],
  filePath: string
) {
  const liqBook: any[] = await loadCSV(filePath);
  const bookUpdate = liqBook.reduce((acc, cur) => {
    const rec = array.find((a) => a.symbol == cur.symbol && a.side == cur.side);
    if (rec) {
      cur.liqSum = Number(cur.liqSum) + Number(rec.liqSum);
    }
    acc.push(cur);
    return acc;
  }, []);
  await writeToCSV(filePath, bookUpdate);
}

// function testChecker(array: LiquidationObj[]) {
//   let arr = _.groupBy(array, "symbol");
//   const keys = Object.keys(arr);
//   const report: any[] = [];
//   keys.forEach((k) => {
//     const _arr = arr[k];
//     const sum = _arr.reduce((acc, cur) => {
//       if (cur.side == "SELL") {
//         acc = acc + Number(cur.liqSum);
//         return acc;
//       }
//     }, 0);
//     report.push({ symbol: k, liqSum: sum });
//   });
//   console.log(report);
// }
export default collectLiquidationData;
