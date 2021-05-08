import Joi from "joi";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { HttpError } from "../../../../../lib/errors";
import validate from "../../../../../lib/validate";

export default api().post(async (req, res) => {
  const { data } = validate(req.body, {
    auctionId: Joi.string().uuid().required(),
    bidderId: Joi.string().uuid().required(),
  });

  const auction = await prisma.auction.findUnique({
    where: {
      id: data.auctionId,
    },
  });

  if (!auction) {
    throw new HttpError(404);
  }

  res.json(
    await prisma.bid.create({
      data: {
        auctionId: data.auctionId,
        bidderId: data.bidderId,
        value: 0, // todo: figure out the logic for this field
      },
    })
  );
});
