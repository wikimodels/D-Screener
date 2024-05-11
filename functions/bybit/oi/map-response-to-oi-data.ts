import { OpenInterestHist } from "../../../models/shared/oi.ts";

export function mapResponseToOiData(
  data: { openInterest: number; timestamp: number }[],
  symbol: string
): OpenInterestHist[] {
  const objs = data.map((d) => {
    return {
      symbol: symbol,
      sumOpenInterest: 0,
      sumOpenInterestValue: d.openInterest,
      timestamp: d.timestamp,
    };
  });
  return objs;
}
