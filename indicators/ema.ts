export function calculateEma(values: number[], period: number) {
  if (values.length === 0) {
    return [];
  }
  const ema = [];
  const alpha = 2 / (period + 1);
  ema[0] = values[0];
  for (let i = 1; i < values.length; i++) {
    ema[i] = alpha * values[i] + (1 - alpha) * ema[i - 1];
  }

  return ema;
}
