import { UnixToTime } from "./functions/utils/time-converter.ts";
import { FundingRate } from "./models/binance/funding-rate.ts";
import { PublicTradeObj } from "./models/bybit/public-trade-data.ts";
import { KlineObj } from "./models/shared/kline.ts";
import { LiquidationRecord } from "./models/shared/liquidation-record.ts";
import { OpenInterest } from "./models/shared/oi.ts";

const kv = await Deno.openKv();

const KlineTf = "Kline_1m";
const OiTf = "Oi_1m";
const FrTf = "Fr_1m";
const LiqTf = "Liq_1m";
const PtTf = "Pt_1m";

const kline_arr: any[] = [];
const oi_arr: any[] = [];
const pt_arr: any[] = [];
const fr_arr: any[] = [];
const liq_arr: any[] = [];

const klineEntries = await kv.list<KlineObj>({
  prefix: [KlineTf],
});
const oiEntries = await kv.list<OpenInterest>({
  prefix: [OiTf],
});
const frEntries = await kv.list<FundingRate>({
  prefix: [FrTf],
});
const ptEntries = await kv.list<PublicTradeObj>({
  prefix: [PtTf],
});

const liqEntries = await kv.list<LiquidationRecord>({
  prefix: [LiqTf],
});

for await (const res of klineEntries) {
  kline_arr.push({
    tf: KlineTf,
    symbol: res.value.symbol,
    closeTime: res.value.closeTime,
  });
}

for await (const res of oiEntries) {
  oi_arr.push({
    tf: OiTf,
    symbol: res.value.symbol,
    closeTime: res.value.timestamp,
  });
}

for await (const res of frEntries) {
  fr_arr.push({
    tf: FrTf,
    symbol: res.value.symbol,
    closeTime: res.value.closeTime,
  });
}

for await (const res of ptEntries) {
  pt_arr.push({
    tf: FrTf,
    symbol: res.value.symbol,
    closeTime: res.value.,
  });
}

for await (const res of liqEntries) {
  liq_arr.push({
    tf: FrTf,
    symbol: res.value.symbol,
    closeTime: res.value.closeTime,
  });
}

kline_arr.forEach((o) => {
  console.log(o.tf, o.symbol, UnixToTime(Number(o.closeTime)));
});

oi_arr.forEach((o) => {
  console.log(o.tf, o.symbol, UnixToTime(Number(o.closeTime)));
});

fr_arr.forEach((o) => {
  console.log(o.tf, o.symbol, UnixToTime(Number(o.closeTime)));
});

pt_arr.forEach((o) => {
  console.log(o.tf, o.symbol, UnixToTime(Number(o.closeTime)));
});

liq_arr.forEach((o) => {
  console.log(o.tf, o.symbol, UnixToTime(Number(o.closeTime)));
});
