import z from "../lib/validation";

const title = z.string().max(80).min(3).nonempty();
const description = z.string().max(2048);
const startingPrice = z.number().positive();
const bidIncrement = z.number().positive();
const reservePrice = z.number().positive();
const buyItNowPrice = z.number().positive();

const attributes = z.array(
  z.object({
    attributeId: z.string().uuid(),
    value: z.string(),
  })
);

const medias = z.array(
  z.object({
    height: z.number().positive(),
    width: z.number().positive(),
    url: z.string().url(),
    thumbnail: z.string().url(),
  })
);

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

export const AuctionSelectSchema = z.object({
  sellerId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  title: title.optional(),
  take: z.number().int().min(1).max(100).optional(),
  skip: z.number().int().min(1).optional(),
});

export const AuctionInsertSchema = z.object({
  categoryId: z.string().uuid().optional(),
  bidIncrement,
  startingPrice,
  reservePrice: reservePrice.nullable(),
  buyItNowPrice: buyItNowPrice.nullable(),
  duration,
  title,
  description,
  attributes,
  medias,
});
