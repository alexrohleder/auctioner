import Joi from "joi";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { HttpError } from "../../../../../lib/errors";
import validate from "../../../../../lib/validate";

export default api().get(async (req, res) => {
  const { where } = validate(req.query, {
    id: Joi.string().uuid().required(),
  });

  const auction = await prisma.auction.findFirst({
    include: {
      bids: {
        select: {
          bidderId: true,
          value: true,
          createdAt: true,
        },
      },
    },
    where,
  });

  if (!auction) {
    throw new HttpError(404);
  }

  res.json(auction);
});
