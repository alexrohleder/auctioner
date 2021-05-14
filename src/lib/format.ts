import comma from "comma-number";

export function money(amount: number) {
  return "$ " + comma((amount / 100).toFixed(2));
}
