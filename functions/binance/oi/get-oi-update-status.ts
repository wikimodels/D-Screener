import { KlineData } from "../../../models/binance/kline.ts";
import { ConsoleColors, print } from "../../utils/print.ts";
import { candlesRepo } from "../candles-repo/create-candles-repo.ts";

export function getOiUpdateStatus(data: KlineData) {
  const symbol: string = data.s;
  const openTime: number = data.k.t;
  const closeTime: number = data.k.T;
  let status: boolean = false;

  const repo = candlesRepo.find((r) => r.symbol);
  if (!repo) {
    throw Error(`${symbol} Repo is not found in CandleRepo`);
  }
  const candle = repo.data.find(
    (c) => c.openTime == openTime && c.closeTime == closeTime
  );
  if (!candle) {
    throw Error(
      `${symbol} OpenTime ${openTime} CloseTime ${closeTime}  Candle is not found in CandleRepo`
    );
  }
  status = candle.oi.isUpdated;
  print(
    ConsoleColors.magenta,
    `${symbol} OI Update Status ${status} time: ${new Date().getTime()}`
  );
  return status;
}
