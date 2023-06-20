export const delayCode = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));
