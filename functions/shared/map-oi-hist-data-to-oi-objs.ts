import { OpenInterest, OpenInterestHist } from "../../models/shared/oi.ts";

export function mapOiHistDataToOiObjs(
  data: OpenInterestHist[]
): OpenInterest[] {
  const objs = data.reduce((acc: OpenInterest[], cur: OpenInterestHist) => {
    const obj: OpenInterest = {
      symbol: cur.symbol,
      oiValue: Number(cur.sumOpenInterestValue),
      timestamp: Number(cur.timestamp),
      closeTime: Number(cur.timestamp),
    };
    acc.push(obj);
    return acc;
  }, []);
  return objs;
}
