import { calculateEma } from "./ema.ts";

export function calculateVO(data: any[]) {
  const values = data.map((v) => v.value);
  const shortEma = calculateEma(values, 5);
  const longEma = calculateEma(values, 10);

  const osc = values.reduce((acc, cur, i) => {
    const _obj = {
      openTime: data[i].openTime,
      value: (100 * (shortEma[i] - longEma[i])) / longEma[i],
    };
    acc.push(_obj);
    return acc;
  }, []);
  return osc;
}
