export interface LiquidationRecord {
  symbol: string;
  closeTime: number;
  buy: {
    liqSum: number;
    counter: number;
  };
  sell: {
    liqSum: number;
    counter: number;
  };
}
