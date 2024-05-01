export interface LiquidationRecord {
  symbol: string;
  buy: {
    isUpdated: boolean;
    liqSum: number;
    counter: number;
  };
  sell: {
    isUpdated: boolean;
    liqSum: number;
    counter: number;
  };
}
