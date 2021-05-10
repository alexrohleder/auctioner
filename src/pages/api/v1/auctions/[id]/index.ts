import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { BadRequestError, HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";

const UpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  bidIncrement: z.number().positive().optional(),
  reservePrice: z.number().positive().optional(),
  buyItNowPrice: z.number().positive().optional(),
  isPublished: z.boolean().optional(),
});

export default api()
  .get(async (req, res) => {
    const id = z.string().uuid().parse(req.query.id);

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
    const id = z.string().uuid().parse(req.query.id);
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
      },
    });

    if (!auction) {
      throw new HttpError(404);
    }

    // todo: if no bids than allow changing starting price

    if (auction.isSettled) {
      throw new BadRequestError("Cannot modify settled auctions");
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
