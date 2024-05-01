import { ConsoleColors, print } from "./print.ts";
import { UnixToISO, UnixToTime } from "./time-converter.ts";

export function calculateStartTime(
  numCandles: number,
  candleInterval: number
): number {
  const now = new Date().getTime();
  const totalInterval = numCandles * candleInterval * 60 * 1000; // Convert minutes
  const startTime = now - totalInterval;
  print(ConsoleColors.magenta, `${UnixToTime(startTime)} ${UnixToTime(now)}`);
  return startTime;
}
