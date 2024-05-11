import { KlineObj } from "../models/shared/kline.ts";

export function calculateWeeklyVwap(klineObj: KlineObj[]): KlineObj[] {
  const weeks = splitByWeeks(klineObj);
  const result: any[] = [];
  for (let i = 0; i < weeks.length; i++) {
    const objs = calculateVWAP(weeks[i]);
    objs.forEach((v) => {
      result.push(v);
    });
  }

  return result;
}

export function calculateDailyVwap(klineObj: KlineObj[]): KlineObj[] {
  const days = splitByDays(klineObj);
  const result: any[] = [];
  for (let i = 0; i < days.length; i++) {
    const objs = calculateVWAP(days[i]);
    objs.forEach((v) => {
      result.push(v);
    });
  }

  return result;
}

function calculateVWAP(klineObjs: KlineObj[]) {
  const res: any[] = [];
  for (let i = 0; i < klineObjs.length; i++) {
    let totalVolume = 0.0;
    let totalProduct = 0.0;
    let firstStdDev = 0.0;

    for (let j = 0; j <= i; j++) {
      totalVolume = Number(totalVolume) + Number(klineObjs[j].baseVolume);
      totalProduct =
        Number(totalProduct) +
        Number(klineObjs[j].hlc3) * Number(klineObjs[j].baseVolume);
    }

    const vwap = Number(totalProduct) / Number(totalVolume);
    if (i == 0) {
      firstStdDev = 0;
    } else {
      firstStdDev = calculateFirstStdDevFromVWAP(klineObjs.slice(0, i), vwap);
    }
    klineObjs[i].vwap.vwapValue = Number(vwap);
    klineObjs[i].vwap.vwap1stDevUp = Number(vwap) + Number(firstStdDev);
    klineObjs[i].vwap.vwap1stDevDown = vwap - firstStdDev;
    res.push(klineObjs[i]);
  }
  console.log(res);
  return res;
}

export function isStartOfMonday(time: number) {
  const day = new Date(time).getDay();
  const hours = new Date(time).getHours();
  const minutes = new Date(time).getMinutes();
  const res = day == 1 && hours == 3 && minutes == 0 ? true : false;
  return res;
}

export function isStartOfDay(time: number) {
  const hours = new Date(time).getHours();
  const minutes = new Date(time).getMinutes();
  const res = hours == 3 && minutes == 0 ? true : false;
  return res;
}

export function splitByWeeks(klineObjs: KlineObj[]) {
  const mondaysIndices: { index: number }[] = [];
  klineObjs.forEach((o, i) => {
    if (isStartOfMonday(o.openTime)) {
      mondaysIndices.push({ index: i });
    }
  });

  const weeks: any[] = [];
  mondaysIndices.forEach((m) => {
    const weekStart = m.index;
    const weekEnd =
      m.index + 168 > klineObjs.length ? klineObjs.length : m.index + 168;
    const week = klineObjs.slice(weekStart, weekEnd);
    weeks.push(week);
  });
  return weeks;
}

export function splitByDays(klineObjs: KlineObj[]) {
  const startsOfDaysIndices: { index: number }[] = [];
  klineObjs.forEach((o, i) => {
    if (isStartOfDay(o.openTime)) {
      startsOfDaysIndices.push({ index: i });
    }
  });

  const days: any[] = [];
  startsOfDaysIndices.forEach((m) => {
    const dayStart = m.index;
    const dayEnd =
      m.index + 96 > klineObjs.length ? klineObjs.length : m.index + 96;
    const week = klineObjs.slice(dayStart, dayEnd);
    days.push(week);
  });
  return days;
}

const calculateFirstStdDevFromVWAP = (objs: KlineObj[], vwap: number) => {
  const prices = objs.map((o) => Number(o.hlc3));
  const volumes = objs.map((o) => Number(o.quoteVolume));

  // Calculate squared deviations from VWAP with volume weighting
  const weightedSquaredDeviations = prices.map((price, index) => {
    const deviation = price - vwap;
    return Math.pow(deviation, 2) * volumes[index];
  });

  // Calculate the total volume
  const totalVolume = volumes.reduce((sum, volume) => sum + volume, 0);

  // Calculate the variance (average weighted squared deviation)
  const variance =
    weightedSquaredDeviations.reduce(
      (sum, weightedDev) => sum + weightedDev,
      0
    ) / totalVolume;

  // Calculate the 1st standard deviation (square root of variance)
  const firstStdDev = Math.sqrt(variance);

  return firstStdDev;
};
