import api from "../../../../../../../lib/api";
import prisma from "../../../../../../../lib/db";
import { HttpError } from "../../../../../../../lib/errors";
import z from "../../../../../../../lib/validation";

const UpdateSchema = z.object({
  name: z.string(),
  type: z.string(),
});

export default api()
  .get(async (req, res) => {
    const id = z.string().uuid().parse(req.query.id);

    const attribute = await prisma.attribute.findUnique({
      where: {
        id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!attribute) {
      throw new HttpError(404);
    }

    res.json(attribute);
  })
  .patch(async (req, res) => {
    const id = z.string().uuid().parse(req.query.id);
    const data = UpdateSchema.parse(req.body);

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
          type: data.type,
        },
      })
    );
  })
  .delete(async (req, res) => {
    const id = z.string().uuid().parse(req.query.id);

    res.json(
      await prisma.attribute.delete({
        where: {
          id,
        },
      })
    );
  });
