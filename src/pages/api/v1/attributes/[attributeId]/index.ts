import { AttributeType } from ".prisma/client";
import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";
import { AttributeUpdateSchema } from "../../../../../schemas/AttributeSchema";

export default api()
  .get(async (req, res) => {
    const id = z.string().uuid().parse(req.query.attributeId);

    const attribute = await prisma.attribute.findUnique({
      where: {
        id,
      },
      include: {
        options: true,
      },
    });

    if (!attribute) {
      throw new HttpError(404);
    }

    res.json(attribute);
  })
  .post(async (req, res) => {
    const id = z.string().uuid().parse(req.query.attributeId);
    const data = AttributeUpdateSchema.parse(req.body);

    const attribute = await prisma.attribute.findUnique({
      where: {
        id,
      },
    });

    if (!attribute) {
      throw new HttpError(404);
    }

    res.json(
      await prisma.attribute.update({
        where: {
          id,
        },
        data: {
          name: data.name,
          isRequired: data.isRequired,
        },
      })
    );
  })
  .delete(async (req, res) => {
    const id = z.string().uuid().parse(req.query.attributeId);

    await prisma.auctionAttribute.deleteMany({
      where: {
        attributeId: id,
      },
    });

    res.json(
      await prisma.attribute.delete({
        where: {
          id,
        },
      })
    );
  });
