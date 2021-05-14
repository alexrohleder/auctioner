import { AuctionStatuses } from ".prisma/client";
import api from "../../../../lib/api";
import prisma from "../../../../lib/db";
import z from "../../../../lib/validation";
import createAuctionResource from "../../../../resources/AuctionResource";
import settlement from "../queues/settlement";

// todo: search by attributes and statuses
// todo: save attributes

const SelectSchema = z.object({
  sellerId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  title: z.string().max(80).min(3).optional(),
  description: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  take: z.number().int().min(1).max(100).optional(),
  skip: z.number().int().min(1).optional(),
});

const InsertSchema = z
  .object({
    sellerId: z.string().uuid(),
    categoryId: z.string().uuid(),
    bidIncrement: z.number().positive(),
    startingPrice: z.number().positive(),
    reservePrice: z.number().positive().nullable(),
    buyItNowPrice: z.number().positive().nullable(),
    duration: z.number().positive(),
    title: z.string().max(80).min(3),
    description: z.string(),
  })
  .refine(
    (data) =>
      data.buyItNowPrice
        ? data.buyItNowPrice >= data.startingPrice * 1.3
        : true,
    {
      message: "Buy it now price must be at least 30% more than starting price",
      path: ["buyItNowPrice"],
    }
  );

export default api()
  .get(async (req, res) => {
    const { take = 10, skip, ...data } = SelectSchema.parse(req.query);

    const auctions = await prisma.auction.findMany({
      include: {
        bids: true,
        statuses: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      where: {
        sellerId: data.sellerId,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      take,
      skip,
    });

    res.json(auctions.map((auction) => createAuctionResource(auction)));
  })
  .post(async (req, res) => {
    const data = InsertSchema.parse(req.body);

    const auction = await prisma.auction.create({
      data: {
        sellerId: data.sellerId,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        startingPrice: data.startingPrice,
        bidIncrement: data.bidIncrement,
        reservePrice: data.reservePrice,
        buyItNowPrice: data.buyItNowPrice,
        duration: data.duration,
        statuses: {
          create: {
            status: AuctionStatuses.OPEN,
          },
        },
      },
    });

    res.json(auction);

    settlement.enqueue(
      { auctionId: auction.id },
      { delay: `${auction.duration} days`, id: auction.id }
    );
  });
