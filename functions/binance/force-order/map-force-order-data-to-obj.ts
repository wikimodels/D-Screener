import {
  ForceOrderData,
  ForceOrderObj,
} from "./../../../models/binance/force-order.ts";
export function mapForceOrderDataToObj(data: ForceOrderData) {
  const obj: ForceOrderObj = {
    eventType: data.e,
    eventTime: data.E,
    order: {
      symbol: data.o.s,
      side: data.o.S,
      orderType: data.o.o,
      timeInForce: data.o.f,
      originalQty: data.o.q,
      price: data.o.p,
      averagePrice: data.o.ap,
      orderStatus: data.o.X,
      lastFilledQty: data.o.l,
      filledAccQty: data.o.z,
      tradeTime: data.o.T,
    },
  };
  return obj;
}
