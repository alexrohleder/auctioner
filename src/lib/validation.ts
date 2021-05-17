import * as zod from "zod";

const z = zod;

export const setValueAsOptionalNumber = (value: string) =>
  value === "" ? undefined : parseFloat(value);

export default z;
