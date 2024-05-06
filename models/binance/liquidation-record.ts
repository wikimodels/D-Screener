export interface LiquidationRecord {
  symbol: string;
  buy: {
    liqSum: number;
    counter: number;
  };
  sell: {
    liqSum: number;
    counter: number;
  };
}
