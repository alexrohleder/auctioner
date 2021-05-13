import { AuctionStatuses } from ".prisma/client";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { BadRequestError, HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";

export default api().post(async (req, res) => {
  const id = z.string().uuid().parse(req.query.auctionId);

  const auction = await prisma.auction.findUnique({
    where: {
      id,
    },
    include: {
      statuses: {
        select: {
          status: true,
        },
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
    throw new BadRequestError("Auction is not open");
  }

  res.json(
    await prisma.auctionStatus.create({
      data: {
        auctionId: auction.id,
        status: AuctionStatuses.CLOSED,
      },
    })
  );

  // todo: notify bidders if any
});
