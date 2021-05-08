import comma from "comma-number";

export function money(amount: number, currencyCode: string) {
  return comma((amount / 100).toFixed(2)) + " " + currencyCode;
}
