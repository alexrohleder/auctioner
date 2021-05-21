import { Queue } from "quirrel/next";
import mail from "../../../lib/mail";
import z from "../../../lib/validation";
import { getAuction } from "../../../queries/Auction";

type Payload = {
  auctionId: string;
};

export default Queue<Payload>("api/queues/notify-new-bid", async (payload) => {
  const id = z.string().uuid().parse(payload.auctionId);
  const auction = await getAuction(id);

  await mail.send({
    to: "alexrohleder96@outlook.com",
    from: "alexrohleder96@gmail.com",
    subject: "hey you got new bids",
    text: "test",
    html: "<strong>test</strong>",
  });
});
