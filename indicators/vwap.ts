// const getPreviousMonday = () => {
//   var date = new Date();
//   var day = date.getDay();
//   var prevMonday = new Date();
//   if (date.getDay() == 0) {
//     prevMonday.setDate(date.getDate() - 7);
//   } else {
//     prevMonday.setDate(date.getDate() - (day - 1));
//   }

//   prevMonday.setHours(3, 0, 0, 0);
//   return prevMonday.getTime() / 1000;
// };

// const isStartOfMonday = (time:number) => {
//   const day = new Date(time * 1000).getDay();
//   const hours = new Date(time * 1000).getHours();
//   const minutes = new Date(time * 1000).getMinutes();
//   const res = day == 1 && hours == 3 && minutes == 0 ? true : false;
//   return res;
// };

// function splitByWeek(data:number[]) {
//   const weeks = [];
//   for (let i = 0; i < data.length - 1; i++) {
//     conast currentWeek = [];
//     if (isStartOfMonday(data[i].openTime)) {
//       currentWeek.push(data[i]);
//       let index = i + 1;
//       while (data && !isStartOfMonday(data[index].openTime)) {
//         currentWeek.push(data[index]);
//         if (index == data.length - 1) {
//           break;
//         } else {
//           index++;
//         }
//       }
//       weeks.push(currentWeek);

//       if (i < data.length - 1) {
//         i = index - 1;
//       }
//     }
//   }
//   return weeks;
// }

// const calculateWeeklyVWAP = (data) => {
//   const weeks = splitByWeek(data);
//   const vwap = [];
//   for (let i = 0; i < weeks.length; i++) {
//     let _vwap = calculateVWAP(weeks[i]);
//     _vwap.forEach((v) => {
//       vwap.push(v);
//     });
//   }
//   console.log(vwap[vwap.length - 2]);
//   return vwap;
// };

// const calculateVWAP = (arr) => {
//   const res = [];
//   for (let i = 0; i < arr.length; i++) {
//     let totalVolume = 0.0;
//     let totalProduct = 0.0;
//     let firstStdDev = 0.0;

//     for (let j = 0; j <= i; j++) {
//       totalVolume = parseFloat(totalVolume) + parseFloat(arr[j].volume);
//       totalProduct =
//         parseFloat(totalProduct) +
//         parseFloat(arr[j].hlc3) * parseFloat(arr[j].volume);
//     }

//     const vwap = new Decimal(totalProduct) / new Decimal(totalVolume);
//     if (i == 0) {
//       firstStdDev = 0;
//     } else {
//       firstStdDev = calculateFirstStdDevFromVWAP(arr.slice(0, i), vwap);
//     }
//     res.push({
//       open: arr[i].open,
//       low: arr[i].low,
//       close: arr[i].close,
//       high: arr[i].high,
//       vwap: parseFloat(vwap).toFixed(3),
//       firstStDevUp: parseFloat(vwap + firstStdDev).toFixed(3),
//       firstStDevDown: parseFloat(vwap - firstStdDev).toFixed(3),
//       openTime: BASIC_UTILS.TIMESTAMP_TO_DATE(arr[i].openTime),
//     });
//   }
//   console.log(res);
//   return res;
// };

// const calculateFirstStdDevFromVWAP = (arr, vwap) => {
//   const prices = arr.map((a) => parseFloat(a.close));
//   const volumes = arr.map((a) => parseFloat(a.volume));

//   // Calculate squared deviations from VWAP with volume weighting
//   const weightedSquaredDeviations = prices.map((price, index) => {
//     const deviation = price - vwap;
//     return Math.pow(deviation, 2) * volumes[index];
//   });

//   // Calculate the total volume
//   const totalVolume = volumes.reduce((sum, volume) => sum + volume, 0);

//   // Calculate the variance (average weighted squared deviation)
//   const variance =
//     weightedSquaredDeviations.reduce(
//       (sum, weightedDev) => sum + weightedDev,
//       0
//     ) / totalVolume;

//   // Calculate the 1st standard deviation (square root of variance)
//   const firstStdDev = Math.sqrt(variance);

//   return firstStdDev;
// };

// module.exports = {
//   calculateEma,
//   calculateVZO,
//   calculateCMF,
//   calculateVO,
//   KlineData,
//   calculateVWAP,
//   splitByWeek,
//   calculateWeeklyVWAP,
// };
