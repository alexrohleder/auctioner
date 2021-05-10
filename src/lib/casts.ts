export const cast = (value: string) => {
  if (
    !Number.isNaN(Number(value)) &&
    typeof value === "string" &&
    value.trim() !== ""
  ) {
    return Number(value);
  }

  if (
    value !== null &&
    (value.toLowerCase() === "true" || value.toLowerCase() === "false")
  ) {
    return value.toLowerCase() === "true";
  }

  return value;
};
