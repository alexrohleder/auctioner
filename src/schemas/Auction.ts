import z from "../lib/validation";

export const InsertSchema = z
  .object({
    sellerId: z.string().uuid(),
    categoryId: z.string().uuid(),
    bidIncrement: z.number().positive(),
    startingPrice: z.number().positive(),
    reservePrice: z.number().positive().nullable(),
    buyItNowPrice: z.number().positive().nullable(),
    duration: z.number().positive(),
    title: z.string(),
    description: z.string(),
    isPublished: z.boolean(),
  })
  .refine(
    (data) =>
      data.buyItNowPrice === null
        ? true
        : data.buyItNowPrice >= data.startingPrice * 1.3,
    {
      message: "Buy it now price must be at least 30% more than starting price",
      path: ["buyItNowPrice"],
    }
  );
