import Joi from "joi";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { BadRequestError, HttpError } from "../../../../../lib/errors";
import validate from "../../../../../lib/validate";

export default api()
  .get(async (req, res) => {
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
  })
  .patch(async (req, res) => {
    const { data } = validate(req.body, {
      id: Joi.string().uuid().required(),
      title: Joi.string(),
      description: Joi.string(),
      bidIncrement: Joi.number().positive().precision(2),
      reservePrice: Joi.number().positive().precision(2),
      buyItNowPrice: Joi.number().positive().precision(2),
      isPublished: Joi.bool(),
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

    if (auction.isSettled) {
      throw new BadRequestError("Cannot modify settled auctions");
    }

    const { id, ...update } = data;

    if (update.reservePrice < auction.bids[0]?.value) {
      throw new BadRequestError(
        "Cannot set reserve price to less than current quote"
      );
    }

    if (update.buyItNowPrice < auction.bids[0]?.value) {
      throw new BadRequestError(
        "Cannot set buy it now price to less than current quote"
      );
    }

    res.json(
      await prisma.auction.update({
        where: {
          id,
        },
        data: update,
      })
    );
  });
