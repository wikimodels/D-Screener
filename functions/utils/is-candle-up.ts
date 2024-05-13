import { convertTimeframeFromStrToNum } from "./convert-timeframe.ts";

function getTargetMinutes(timeframe: string): number[] {
  const tf: number = convertTimeframeFromStrToNum(timeframe);
  const targetMinutes: number[] = [];
  for (let i = tf - 1; i < 60; i = i + tf) {
    targetMinutes.push(i);
  }
  return targetMinutes;
}

export function isCandleIsUp(timeframe: string) {
  const currentTime = new Date();
  const targetMinutes = getTargetMinutes(timeframe);
  const currentMinute = currentTime.getMinutes();
  const currentSecond = currentTime.getSeconds();
  return targetMinutes.includes(currentMinute) && currentSecond == 59;
}
