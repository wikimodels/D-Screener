export function getCandleInterval(timeframe: string) {
  switch (timeframe) {
    case "1m":
      return 1;
    case "2m":
      return 2;
    case "3m":
      return 3;
    case "5m":
      return 5;
    case "10m":
      return 10;
    case "15m":
      return 15;
    case "30m":
      return 30;
    case "1h":
      return 60;
    case "2h":
      return 120;
    case "4h":
      return 240;
    case "6h":
      return 360;
    case "8h":
      return 480;
    case "12h":
      return 720;
    case "D":
      return 1440;
    default:
      throw Error("No such timeframe");
  }
}
