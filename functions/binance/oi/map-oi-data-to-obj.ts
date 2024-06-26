import { OpenInterest, OpenInterestData } from "../../../models/shared/oi.ts";
export function mapOiDataToObj(
  oiData: OpenInterestData,
  closeTime: number
): OpenInterest {
  const obj: OpenInterest = {
    oiValue: oiData.openInterest,
    timestamp: oiData.time,
    symbol: oiData.symbol,
    closeTime: closeTime,
  };
  return obj;
}
