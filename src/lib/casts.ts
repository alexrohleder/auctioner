export const cast = (value: any) => {
  if (typeof value !== "string") {
    return value;
  }

  if (!Number.isNaN(Number(value)) && value.trim() !== "") {
    return Number(value);
  }

  if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
    return value.toLowerCase() === "true";
  }

  if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
    return new Date(value);
  }

  return value;
};
