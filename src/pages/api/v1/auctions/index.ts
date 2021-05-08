import Joi from "joi";
import api from "../../../../lib/api";
import prisma from "../../../../lib/db";
import validate from "../../../../lib/validate";

export default api()
  .get(async (req, res) => {
    const { take, skip, where } = validate(req.query, {
      ...validate.pagination,
      sellerId: Joi.string().uuid(),
      title: Joi.string(),
      description: Joi.string(),
      isPublished: Joi.bool(),
      isSettled: Joi.bool(),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
    });

    res.json(
      await prisma.auction.findMany({
        include: {
          bids: {
            select: {
              bidderId: true,
              value: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take,
        where,
        skip,
      })
    );
  })
  .post(async (req, res) => {
    const { data } = validate(req.body, {
      sellerId: Joi.string().uuid().required(),
      title: Joi.string().required(),
      description: Joi.string(),
      startingPrice: Joi.number().positive().required(),
      bidIncrement: Joi.number().positive().required(),
      isPublished: Joi.bool().required(),
      isSettled: Joi.bool().required(),
    });

    res.json(
      await prisma.auction.create({
        data: {
          sellerId: data.sellerId,
          title: data.title,
          description: data.description,
          startingPrice: data.startingPrice,
          bidIncrement: data.bidIncrement,
          currencyCode: data.currencyCode,
          isPublished: data.isPublished,
          isSettled: data.isSettled,
        },
      })
    );
  });
