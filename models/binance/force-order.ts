export interface ForceOrderData {
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

export interface ForceOrderObj {
  eventType: string;
  eventTime: number;
  order: {
    symbol: string;
    side: string;
    orderType: string;
    timeInForce: string;
    originalQty: number;
    price: number;
    averagePrice: number;
    orderStatus: string;
    lastFilledQty: number;
    filledAccQty: number;
    tradeTime: number;
  };
}
