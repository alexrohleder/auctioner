import prisma from "../../../../lib/db";
import { Queue } from "quirrel/next";
import mail from "../../../../lib/mail";

type Payload = {
  auctionId: string;
};

export default Queue<Payload>(
  "api/v1/queues/notify-new-bid",
  async (payload) => {
    const auction = await prisma.auction.findUnique({
      where: {
        id: payload.auctionId,
      },
      include: {
        bids: {
          select: {
            customerId: true,
            value: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    await mail.send({
      to: "alexrohleder96@outlook.com",
      from: "alexrohleder96@gmail.com",
      subject: "hey you got new bids",
      text: "test",
      html: "<strong>test</strong>",
    });
  }
);
