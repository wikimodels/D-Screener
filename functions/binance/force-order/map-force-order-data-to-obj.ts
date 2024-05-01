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
      originalQty: Number(data.o.q),
      price: Number(data.o.p),
      averagePrice: Number(data.o.ap),
      orderStatus: data.o.X,
      lastFilledQty: Number(data.o.l),
      filledAccQty: Number(data.o.z),
      tradeTime: Number(data.o.T),
    },
  };
  return obj;
}
