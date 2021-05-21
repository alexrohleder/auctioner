import z from "../lib/validation";
import { PaginationSchema } from "./helpers";

const review = z.string().min(3).max(2048);

export const SelectReviewSchema = z.object({
  reviewerId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  ...PaginationSchema,
});

export const InsertReviewSchema = z.object({
  userId: z.string().uuid(),
  review,
});

export const UpdateReviewSchema = z.object({
  review,
});
