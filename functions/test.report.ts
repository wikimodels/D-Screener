import { load } from "https://deno.land/std@0.223.0/dotenv/mod.ts";
import { candlesRepo } from "./binance/candles-repo/create-candles-repo.ts";
import * as _ from "https://cdn.skypack.dev/lodash";
import { UnixToTime } from "./utils/time-converter.ts";

export function testReport() {
  //   candlesRepo.forEach((r) => {
  //     r.data.forEach((d) => {
  //       console.log(
  //         `${r.symbol} OpenTime ${UnixToTime(d.openTime)} CloseTime ${UnixToTime(
  //           d.closeTime
  //         )}`
  //       );
  //       console.log(`${r.symbol} Oi timestamp ${UnixToTime(d.oi.timestamp)}`);
  //       print(ConsoleColors.yellow, "=========================================");
  //     });
  //   });
  let report: any[] = [];
  candlesRepo.forEach((r) => {
    r.data.forEach((d) => {
      const obj = {
        symbol: d.symbol,
        openTime: UnixToTime(d.openTime),
        closeTime: UnixToTime(d.closeTime),
        oiValue: d.oi.oiValue,
        isOiUpdated: d.oi.isUpdated,
        openUnixTime: d.openTime,
        closeUnixTime: d.closeTime,
        oiUnixTime: d.oi.timestamp,
      };
      report.push(obj);
    });
  });
  report = _.groupBy(report, "symbol");

  return report;
}

export function horizontalTimer(targetTime: number) {
  const startTime = Date.now();
  const totalTime = targetTime;

  let elapsedTime = 0;

  const progressChar = "="; // Character representing progress
  const emptyChar = " "; // Character representing empty space

  const fixedWidth = 20; // Adjust as desired

  do {
    elapsedTime = Math.min(Date.now() - startTime, totalTime);
    const progressLength = Math.floor((elapsedTime / totalTime) * fixedWidth);

    // Clear the previous line (optional)
    // Deno doesn't have a built-in clear line function, so comment out if not supported by your terminal
    // console.clearLine();

    // Create the progress string with padding
    const progressString = `${progressChar.repeat(
      progressLength
    )}${emptyChar.repeat(fixedWidth - progressLength)}`;

    // Print the progress string
    console.log(progressString);
  } while (elapsedTime < totalTime);

  console.log("Countdown finished!");
}
