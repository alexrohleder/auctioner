import Joi from "joi";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { HttpError } from "../../../../../lib/errors";
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
      bidIncrement: Joi.number().positive(),
      isPublished: Joi.bool(),
      isSettled: Joi.bool(),
    });

    const auction = await prisma.auction.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!auction) {
      throw new HttpError(404);
    }

    const { id, ...update } = data;

    res.json(
      await prisma.auction.update({
        where: {
          id,
        },
        data: update,
      })
    );
  });
