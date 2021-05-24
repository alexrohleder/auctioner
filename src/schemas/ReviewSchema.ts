import z from "../lib/validation";
import { PaginationSchema } from "./helpers";

const review = z.string().min(3).max(2048);

export const SelectReviewSchema = z
  .object({
    reviewerId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    ...PaginationSchema,
  })
  .refine((data) => data.reviewerId || data.userId, {
    message: "Cannot request reviews without a filter",
  });

export const InsertReviewSchema = z.object({
  userId: z.string().uuid(),
  review,
});

export const UpdateReviewSchema = z.object({
  review,
});
