import { getSession } from "next-auth/client";
import api from "../../../../lib/api";
import cacheRes from "../../../../lib/cache-res";
import { createReview, getReviews } from "../../../../queries/Review";
import {
  InsertReviewSchema,
  SelectReviewSchema,
} from "../../../../schemas/ReviewSchema";

export default api()
  .get(async (req, res) => {
    const { take = 10, skip, ...data } = SelectReviewSchema.parse(req.query);

    cacheRes(res, "1d");

    res.json(
      await getReviews({
        where: {
          reviewerId: data.reviewerId,
          userId: data.userId,
        },
        take,
        skip,
      })
    );
  })
  .post(async (req, res) => {
    const input = InsertReviewSchema.parse(req.body);
    const session = await getSession({ req });

    res.json(
      await createReview({
        reviewerId: session!.user.id as string,
        userId: input.userId,
        review: input.review,
      })
    );
  });
