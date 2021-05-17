import z from "../lib/validation";

const title = z.string().max(80).min(3).nonempty();
const description = z.string().max(2048);
const startingPrice = z.number().positive();
const bidIncrement = z.number().positive();
const reservePrice = z.number().positive();
const buyItNowPrice = z.number().positive();

const duration = z
  .number()
  .positive()
  .refine((d) => [3, 5, 7, 10].includes(d));

export const AuctionUpdateSchema = z.object({
  title: title.optional(),
  description: description.optional(),
  startingPrice: startingPrice.optional(),
  bidIncrement: bidIncrement.optional(),
  reservePrice: reservePrice.optional(),
  buyItNowPrice: buyItNowPrice.optional(),
  duration: duration.optional(),
});
