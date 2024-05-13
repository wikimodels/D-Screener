import { OpenInterest } from "../../../models/shared/oi.ts";

export function mapResponseToOiObj(
  data: { openInterest: number; timestamp: number },

  symbol: string
): OpenInterest {
  return {
    symbol: symbol,
    oiValue: Number(data.openInterest),
    timestamp: Number(data.timestamp),
    closeTime: Number(data.timestamp),
  };
}
