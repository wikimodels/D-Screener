import { KlineObj } from "../models/binance/kline.ts";

function getPreviousMonday() {
  const date = new Date();
  const day = date.getDay();
  const prevMonday = new Date();
  if (date.getDay() == 0) {
    prevMonday.setDate(date.getDate() - 7);
  } else {
    prevMonday.setDate(date.getDate() - (day - 1));
  }

  prevMonday.setHours(3, 0, 0, 0);
  return prevMonday.getTime() / 1000;
}

export function isStartOfMonday(time: number) {
  const day = new Date(time * 1000).getDay();
  const hours = new Date(time * 1000).getHours();
  const minutes = new Date(time * 1000).getMinutes();
  const res = day == 1 && hours == 3 && minutes == 0 ? true : false;
  return res;
}

export function splitByWeek(klineObjs: KlineObj[]) {
  const weeks = [];
  for (let i = 0; i < klineObjs.length - 1; i++) {
    const currentWeek = [];
    if (isStartOfMonday(klineObjs[i].openTime)) {
      currentWeek.push(klineObjs[i]);
      let index = i + 1;
      while (klineObjs && !isStartOfMonday(klineObjs[index].openTime)) {
        currentWeek.push(klineObjs[index]);
        if (index == klineObjs.length - 1) {
          break;
        } else {
          index++;
        }
      }
      weeks.push(currentWeek);

      if (i < klineObjs.length - 1) {
        i = index - 1;
      }
    }
  }
  return weeks;
}

function calculateWeeklyVWAP(klineObj: KlineObj[]) {
  const weeks = splitByWeek(klineObj);
  const vwap: any[] = [];
  for (let i = 0; i < weeks.length; i++) {
    const _vwap = calculateVWAP(weeks[i]);
    _vwap.forEach((v) => {
      vwap.push(v);
    });
  }
  console.log(vwap[vwap.length - 2]);
  return vwap;
}

const calculateVWAP = (klineObjs: KlineObj[]) => {
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
};

const calculateFirstStdDevFromVWAP = (arr, vwap) => {
  const prices = arr.map((a) => Number(a.close));
  const volumes = arr.map((a) => Number(a.volume));

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
