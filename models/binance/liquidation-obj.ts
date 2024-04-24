export interface LiquidationObj {
  symbol: string;
  side: string;
  timestamp: number;
  liqSum: number;
}

export interface LiquidationData {
  e: string;
  E: number;
  o: {
    s: string;
    S: string;
    o: string;
    f: string;
    q: number;
    p: number;
    ap: number;
    X: string;
    l: number;
    z: number;
    T: number;
  };
}
