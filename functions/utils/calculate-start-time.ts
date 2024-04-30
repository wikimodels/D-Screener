import { UnixToISO } from "./time-converter.ts";

export function calculateStartTime(
  numCandles: number,
  candleInterval: number
): number {
  const now = new Date().getTime();
  const totalInterval = numCandles * candleInterval * 60 * 1000; // Convert minutes
  const startTime = now - totalInterval;
  console.log("startTime", UnixToISO(startTime));
  console.log("now", UnixToISO(now));
  return startTime;
}
