import { QueueMsg } from "./../../models/queue-task.ts";
import { FundingRate } from "../../models/binance/funding-rate.ts";
import { KlineObj } from "../../models/shared/kline.ts";
import { LiquidationRecord } from "../../models/shared/liquidation-record.ts";
import { OpenInterest } from "../../models/shared/oi.ts";
import { PublicTradeRecord } from "../../models/bybit/public-trade-record.ts";
import { KvOps } from "./kv-ops.ts";
import { UnixToTime } from "../utils/time-converter.ts";
const kv = await Deno.openKv();

export function listenQueues() {
  try {
    kv.listenQueue(async (msg: QueueMsg) => {
      if (msg.queueName == KvOps.saveKlineObjToKv) {
        const obj = msg.data.dataObj as KlineObj;
        const closeTime = msg.data.closeTime;
        const symbol: string = obj.symbol;
        await kv.set([`Kline_${msg.timeframe}`, symbol, closeTime], obj);
      }
      if (msg.queueName == KvOps.saveFrObjToKv) {
        const obj: FundingRate = msg.data.dataObj as FundingRate;
        const closeTime: number = msg.data.closeTime;
        const prevRecord = (
          await kv.get([`Fr_${msg.timeframe}`, obj.symbol, closeTime])
        ).value as FundingRate;
        if (
          !prevRecord ||
          prevRecord.fr != obj.fr ||
          prevRecord.nextFundingTime != obj.nextFundingTime
        ) {
          await kv.set([`Fr_${msg.timeframe}`, obj.symbol, closeTime], obj);
        }
      }
      if (msg.queueName == KvOps.saveLiqObjToKv) {
        const obj: LiquidationRecord = msg.data.dataObj as LiquidationRecord;
        const closeTime: number = msg.data.closeTime;
        const record: Deno.KvEntryMaybe<LiquidationRecord> =
          await kv.get<LiquidationRecord>([
            `Liq_${msg.timeframe}`,
            obj.symbol,
            closeTime,
          ]);

        if (!record.value) {
          const res = await kv.set(
            [`Liq_${msg.timeframe}`, obj.symbol, closeTime],
            obj
          );
          console.log(
            obj.symbol,
            "Liq inserted",
            res.ok,
            UnixToTime(new Date().getTime())
          );
        }
      }
      if (msg.queueName == KvOps.saveOiObjToKv) {
        const obj = msg.data.dataObj as OpenInterest;
        const closeTime: number = msg.data.closeTime;
        const record: Deno.KvEntryMaybe<OpenInterest> =
          await kv.get<OpenInterest>([
            `Oi_${msg.timeframe}`,
            obj.symbol,
            closeTime,
          ]);

        if (!record.value) {
          await kv.set([`Oi_${msg.timeframe}`, obj.symbol, closeTime], obj);
        }
      }
      if (msg.queueName == KvOps.savePtObjToKv) {
        const obj: PublicTradeRecord = msg.data.dataObj as PublicTradeRecord;
        const closeTime: number = msg.data.closeTime;
        const record: Deno.KvEntryMaybe<PublicTradeRecord> =
          await kv.get<PublicTradeRecord>([
            `Pt_${msg.timeframe}`,
            obj.symbol,
            closeTime,
          ]);

        if (!record.value) {
          const res = await kv.set(
            [`Pt_${msg.timeframe}`, obj.symbol, closeTime],
            obj
          );
          console.log(
            obj.symbol,
            "PT inserted",
            res.ok,
            UnixToTime(new Date().getTime())
          );
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
}
