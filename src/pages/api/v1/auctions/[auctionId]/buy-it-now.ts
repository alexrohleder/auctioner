import { AuctionStatuses } from ".prisma/client";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { BadRequestError, HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";

export default api().post(async (req, res) => {
  const id = z.string().uuid().parse(req.query.auctionId);
  const customerId = z.string().uuid().parse(req.body.customerId);

  const auction = await prisma.auction.findUnique({
    where: {
      id,
    },
    include: {
      statuses: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!auction) {
    throw new HttpError(404);
  }

  if (auction.statuses[0].status !== AuctionStatuses.OPEN) {
    throw new BadRequestError("Cannot buy auctions that are not open");
  }

  // todo: payment

  res.json(
    await prisma.auctionStatus.create({
      data: {
        auctionId: id,
        status: AuctionStatuses.SOLD,
      },
    })
  );

  // todo: notify seller
});
