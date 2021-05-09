import Joi from "joi";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { HttpError } from "../../../../../lib/errors";
import validate from "../../../../../lib/validate";
import settlement from "../../queues/settlement";

export default api().post(async (req, res) => {
  const { data } = validate(req.query, {
    id: Joi.string().uuid().required(),
  });

  const auction = await prisma.auction.findUnique({
    where: {
      id: data.id,
    },
    include: {
      bids: {
        select: {
          value: true,
        },
        orderBy: {
          value: "desc",
        },
        take: 1,
      },
    },
  });

  if (!auction) {
    throw new HttpError(404);
  }

  if (auction.bids.length === 0) {
    await prisma.auction.update({
      where: {
        id: data.id,
      },
      data: {
        isSettled: true,
      },
    });

    return res.json({ status: "CLOSED" });
  }

  settlement.enqueue({ auctionId: data.id }, { id: data.id });
  res.json({ status: "ENQUEUED" });
});
