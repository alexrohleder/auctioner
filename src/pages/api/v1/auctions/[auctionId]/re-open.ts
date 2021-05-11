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
  });

  if (!auction) {
    throw new HttpError(404);
  }

  if (!auction.isSettled) {
    throw new BadRequestError("Cannot re-open a not settled auction");
  }

  if (!auction.isPublished) {
    throw new BadRequestError("Cannot re-open a unpublished auction");
  }

  res.json(
    await prisma.auction.update({
      where: {
        id: auction.id,
      },
      data: {
        isPublished: true,
        isSettled: false,
      },
    })
  );
});
