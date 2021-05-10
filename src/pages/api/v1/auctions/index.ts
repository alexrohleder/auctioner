import api from "../../../../lib/api";
import prisma from "../../../../lib/db";
import z from "../../../../lib/validation";
import notifyNewBid from "../queues/notify-new-bid";
import settlement from "../queues/settlement";

// todo: search by attributes
// todo: save attributes

const SelectSchema = z.object({
  sellerId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  isPublished: z.boolean().optional(),
  isSettled: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  take: z.number().int().min(1).max(100),
  skip: z.number().int().min(1).optional(),
});

const InsertSchema = z.object({
  sellerId: z.string().uuid(),
  categoryId: z.string().uuid(),
  bidIncrement: z.number().positive(),
  startingPrice: z.number().positive(),
  reservePrice: z.number().positive().optional(),
  buyItNowPrice: z.number().positive().optional(),
  duration: z.number().positive(),
  title: z.string(),
  description: z.string(),
  isPublished: z.boolean(),
});

export default api()
  .get(async (req, res) => {
    const { take = 10, skip, ...data } = SelectSchema.parse(req.query);

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
        where: {
          sellerId: data.sellerId,
          title: data.title,
          description: data.description,
          isPublished: data.isPublished,
          isSettled: data.isSettled,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        take,
        skip,
      })
    );

    notifyNewBid.enqueue({ auctionId: "" });
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
