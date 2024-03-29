import { getSession } from "next-auth/client";
import api from "../../../../lib/api";
import cacheRes from "../../../../lib/cache-res";
import { createAuction, getAuctions } from "../../../../queries/Auction";
import {
  AuctionInsertSchema,
  AuctionSelectSchema,
} from "../../../../schemas/AuctionSchema";
import settlement from "../../queues/settlement";

export default api()
  .get(async (req, res) => {
    const { take = 10, skip, ...data } = AuctionSelectSchema.parse(req.query);

    cacheRes(res, "3s", "1m");

    res.json(
      await getAuctions({
        where: {
          sellerId: data.sellerId,
          categoryId: data.categoryId,
          title: data.title && {
            contains: data.title,
            mode: "insensitive",
          },
        },
        take,
        skip,
      })
    );
  })
  .post(async (req, res) => {
    const data = AuctionInsertSchema.parse(req.body);
    const session = await getSession({ req });

    const auction = await createAuction({
      sellerId: session!.user.id as string,
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,
      startingPrice: data.startingPrice,
      bidIncrement: data.bidIncrement,
      reservePrice: data.reservePrice,
      buyItNowPrice: data.buyItNowPrice,
      duration: data.duration,
      attributes: {
        createMany: {
          data: data.attributes,
        },
      },
      medias: {
        createMany: {
          data: data.medias,
        },
      },
    });

    res.json(auction);

    settlement.enqueue(
      { auctionId: auction.id },
      { delay: `${auction.duration} days`, id: auction.id }
    );
  });
