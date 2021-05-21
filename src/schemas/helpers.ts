import z from "../lib/validation";

export const PaginationSchema = {
  take: z.number().int().min(1).max(100).optional(),
  skip: z.number().int().min(1).optional(),
};
