import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import z from "../../../../../lib/validation";

export default api().post(async (req, res) => {
  const id = z.string().uuid().parse(req.query.id);
  const customerId = z.string().uuid().parse(req.body.customerId);

  // todo: payment

  await prisma.auction.update({
    where: {
      id,
    },
    data: {
      isSettled: true,
    },
  });

  res.json({
    isSettled: true,
    payment: "DONE",
  });
});
