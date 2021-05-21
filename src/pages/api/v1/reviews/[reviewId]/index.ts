import { getSession } from "next-auth/client";
import api from "../../../../../lib/api";
import { HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";
import {
  deleteReview,
  getReview,
  updateReview,
} from "../../../../../queries/Review";
import { UpdateReviewSchema } from "../../../../../schemas/ReviewSchema";

export default api()
  .get(async (req, res) => {
    const id = z.string().uuid().parse(req.query.reviewId);

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=600"
    );

    const review = await getReview(id);

    if (!review) {
      throw new HttpError(404);
    }

    res.json(review);
  })
  .post(async (req, res) => {
    const id = z.string().uuid().parse(req.query.reviewId);
    const input = UpdateReviewSchema.parse(req.body);
    const session = await getSession({ req });
    const review = await getReview(id);

    if (!review) {
      throw new HttpError(404);
    }

    if (review.reviewer.id !== session!.user.id) {
      throw new HttpError(403);
    }

    res.json(
      await updateReview(id, {
        review: input.review,
      })
    );
  })
  .delete(async (req, res) => {
    const id = z.string().uuid().parse(req.query.reviewId);
    const session = await getSession({ req });
    const review = await getReview(id);

    if (!review) {
      throw new HttpError(404);
    }

    if (review.reviewer.id !== session!.user.id) {
      throw new HttpError(403);
    }

    res.json(await deleteReview(id));
  });
