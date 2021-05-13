import { AuctionStatuses } from ".prisma/client";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { BadRequestError, HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";

const UpdateSchema = z.object({
  title: z.string().max(80).min(3).optional(),
  description: z.string().optional(),
  startingPrice: z.number().positive().optional(),
  bidIncrement: z.number().positive().optional(),
  reservePrice: z.number().positive().optional(),
  buyItNowPrice: z.number().positive().optional(),
  isPublished: z.boolean().optional(),
});

export default api()
  .get(async (req, res) => {
    const id = z.string().uuid().parse(req.query.auctionId);

    const auction = await prisma.auction.findUnique({
      include: {
        bids: {
          select: {
            customerId: true,
            value: true,
            createdAt: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (!auction) {
      throw new HttpError(404);
    }

    res.json(auction);
  })
  .patch(async (req, res) => {
    const id = z.string().uuid().parse(req.query.auctionId);
    const data = UpdateSchema.parse(req.body);

    const auction = await prisma.auction.findUnique({
      where: {
        id,
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

    if (auction.statuses[0].status === AuctionStatuses.SOLD) {
      throw new BadRequestError("Cannot modify sold auctions");
    }

    if (data.startingPrice && auction.bids.length > 0) {
      throw new BadRequestError("Cannot modify starting price after first bid");
    }

    if (data.reservePrice && data.reservePrice < auction.bids[0]?.value) {
      throw new BadRequestError(
        "Cannot set reserve price to less than current quote"
      );
    }

    if (data.buyItNowPrice && data.buyItNowPrice < auction.bids[0]?.value) {
      throw new BadRequestError(
        "Cannot set buy it now price to less than current quote"
      );
    }

    res.json(
      await prisma.auction.update({
        where: {
          id,
        },
        data,
      })
    );
  });
