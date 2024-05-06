import { FundingRate } from "../../models/binance/funding-rate.ts";
import { KlineData, KlineObj } from "../../models/binance/kline.ts";
import { LiquidationRecord } from "../../models/binance/liquidation-record.ts";
import { OpenInterest, OpenInterestHist } from "../../models/binance/oi.ts";
import { Msg } from "../../models/queue-task.ts";

const kv = await Deno.openKv("15m");

export function listenQueues() {
  try {
    kv.listenQueue(async (msg: Msg) => {
      if (msg.queueName == "loadInitalKlineObjToKv") {
        const obj = msg.data.dataObj as KlineObj;
        await kv.set(["Kline", obj.symbol, msg.data.closeTime], obj);
      }
      if (msg.queueName == "loadOiToInitialKlineObj") {
        const obj = msg.data.dataObj as OpenInterestHist;
        const symbol: string = obj.symbol;

        const entries = await kv.list<KlineObj>({ prefix: ["Kline"] });
        for await (const res of entries) {
          const klineObj: KlineObj = res.value;
          if (
            klineObj.openTime < obj.timestamp - 1000 &&
            klineObj.closeTime > obj.timestamp - 1000 &&
            klineObj.symbol == obj.symbol
          ) {
            klineObj.oi = {
              symbol: symbol,
              oiValue: obj.sumOpenInterestValue,
              timestamp: obj.timestamp,
              closeTime: klineObj.closeTime,
            };
            await kv.set(["Kline", symbol, klineObj.closeTime], klineObj);
          }
        }
      }
      if (msg.queueName == "insertKlineWsDataIntoObj") {
        const obj = msg.data.dataObj as KlineObj;
        const closeTime = msg.data.closeTime;
        const symbol: string = obj.symbol;

        const entries = await kv.list<KlineObj>({ prefix: ["Kline"] });
        for await (const res of entries) {
          if (
            res.value.closeTime == closeTime &&
            res.value.symbol == obj.symbol
          ) {
            await kv.delete(["Kline", symbol, closeTime]);
          }
          await kv.set(["Kline", symbol, closeTime], obj);
        }
      }
      if (msg.queueName == "insertFundingRateRecord") {
        const obj: FundingRate = msg.data.dataObj as FundingRate;
        const closeTime: number = msg.data.closeTime;
        const prevRecord = (await kv.get(["Fr", obj.symbol, closeTime]))
          .value as FundingRate;
        if (!prevRecord || prevRecord.fr != obj.fr) {
          await kv.set(["Fr", obj.symbol, closeTime], obj);
          console.log("Fr inserted", obj.symbol, obj.fr);
        }
      }

      if (msg.queueName == "insertLiquidationRecord") {
        const obj: LiquidationRecord = msg.data.dataObj as LiquidationRecord;
        const closeTime: number = msg.data.closeTime;
        const record: Deno.KvEntryMaybe<LiquidationRecord> =
          await kv.get<LiquidationRecord>(["Liq", obj.symbol, closeTime]);
        if (!record.value) {
          await kv.set(["Liq", obj.symbol, closeTime], obj);
        }
      }

      if (msg.queueName == "insertOiRecord") {
        const obj = msg.data.dataObj as OpenInterest;
        const closeTime: number = msg.data.closeTime;
        const record: Deno.KvEntryMaybe<OpenInterest> =
          await kv.get<OpenInterest>(["Oi", obj.symbol, closeTime]);
        if (!record.value) {
          await kv.set(["Oi", obj.symbol, closeTime], obj);
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
}
