export const SYNQ = {
  loadInitalKlineData: {
    timeframe: "1m", //string 1m, 1h, ect.
    numCandles: "10", //number of candles to fetch
  },
  loadInitialOiHistData: {
    timeframe: "1m",
    numCandles: "10", //number of candles to fetch
  },
  createCandlesRepo: {
    timeframe: "1m",
  },
  wsTimeframe: "1m",
  calculateCMF: {
    chMfLen: 20,
    chMfEmaLen: 20,
  },
};
