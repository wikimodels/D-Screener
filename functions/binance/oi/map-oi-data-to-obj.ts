import {
  OpenInterest,
  OpenInterestData,
} from "./../../../models/binance/oi.ts";
export function mapOiDataToObj(oiData: OpenInterestData): OpenInterest {
  const obj: OpenInterest = {
    oiValue: oiData.openInterest,
    timestamp: oiData.time,
    symbol: oiData.symbol,
    isUpdated: false,
  };
  return obj;
}
