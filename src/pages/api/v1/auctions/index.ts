import Joi from "joi";
import api from "../../../../lib/api";
import prisma from "../../../../lib/db";
import validate from "../../../../lib/validate";
import notifyNewBid from "../queues/notify-new-bid";
import settlement from "../queues/settlement";

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
              customerId: true,
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

    notifyNewBid.enqueue({ auctionId: "" });
  })
  .post(async (req, res) => {
    const { data } = validate(req.body, {
      sellerId: Joi.string().uuid().required(),
      bidIncrement: Joi.number().positive().precision(2).required(),
      startingPrice: Joi.number().positive().precision(2).required(),
      reservePrice: Joi.number()
        .positive()
        .precision(2)
        .greater(Joi.ref("startingPrice")),
      buyItNowPrice: Joi.number()
        .positive()
        .precision(2)
        .greater(Joi.ref("startingPrice")),
      duration: Joi.number().allow(3, 5, 7, 10).required(),
      title: Joi.string().required(),
      description: Joi.string(),
      isPublished: Joi.bool().required(),
    });

    const auction = await prisma.auction.create({
      data: {
        sellerId: data.sellerId,
        title: data.title,
        description: data.description,
        startingPrice: data.startingPrice,
        bidIncrement: data.bidIncrement,
        currencyCode: data.currencyCode,
        duration: data.duration,
        isPublished: data.isPublished,
        isSettled: false,
      },
    });

    res.json(auction);

    settlement.enqueue(
      { auctionId: auction.id },
      { delay: `${auction.duration} days`, id: auction.id }
    );
  });
