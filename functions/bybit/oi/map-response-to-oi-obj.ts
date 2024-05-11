import { OpenInterest } from "../../../models/shared/oi.ts";

export function mapResponseToOiObj(
  data: { openInterest: number; timestamp: number },
  closeTime: number,
  symbol: string
): OpenInterest {
  return {
    symbol: symbol,
    oiValue: data.openInterest,
    timestamp: data.timestamp,
    closeTime: closeTime,
  };
}
