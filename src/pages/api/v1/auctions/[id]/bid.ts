import Joi from "joi";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { BadRequestError, HttpError } from "../../../../../lib/errors";
import validate from "../../../../../lib/validate";
import notifyNewBid from "../../queues/notify-new-bid";
import settlement from "../../queues/settlement";

export default api().post(async (req, res) => {
  const { data } = validate(
    {
      ...req.body,
      id: req.query.id,
    },
    {
      id: Joi.string().uuid().required(),
      customerId: Joi.string().uuid().required(),
      value: Joi.number().positive().precision(2).min(1).required(),
    }
  );

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

  if (auction.isSettled) {
    // todo: perhaps test current time against auction duration too?
    throw new BadRequestError("Cannot bid in settled auctions");
  }

  if (auction.bids[0]) {
    if (auction.bids[0].value >= data.value) {
      throw new BadRequestError("Cannot bid less than current quote");
    }

    if (data.value - auction.bidIncrement !== auction.bids[0].value) {
      throw new BadRequestError("Cannot bid less than bid increment");
    }
  } else {
    if (data.value !== auction.bidIncrement) {
      throw new BadRequestError("Cannot bid different than bid increment");
    }
  }

  res.json(
    await prisma.bid.create({
      data: {
        auctionId: data.id,
        customerId: data.customerId,
        value: data.value,
      },
    })
  );

  // todo: if we reach the buy it now call this:
  // settlement.enqueue({ auctionId: data.id }, { id: data.id });

  notifyNewBid.enqueue(
    { auctionId: data.id },
    { id: data.id, delay: "10 minutes" } // so we batch notifications
  );
});
