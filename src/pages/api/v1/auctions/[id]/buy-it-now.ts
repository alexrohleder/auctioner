import Joi from "joi";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import validate from "../../../../../lib/validate";

export default api().post(async (req, res) => {
  const { data } = validate(
    {
      ...req.body,
      id: req.query.id,
    },
    {
      id: Joi.string().uuid().required(),
      customerId: Joi.string().uuid().required(),
    }
  );

  // todo: payment

  await prisma.auction.update({
    where: {
      id: data.id,
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
