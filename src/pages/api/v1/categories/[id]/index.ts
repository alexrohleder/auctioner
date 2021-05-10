import api from "../../../../../lib/api";
import prisma from "../../../../../lib/db";
import { HttpError } from "../../../../../lib/errors";
import z from "../../../../../lib/validation";

const UpdateSchema = z.object({
  name: z.string(),
});

export default api()
  .get(async (req, res) => {
    const id = z.string().uuid().parse(req.query.id);

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        auctions: {
          select: {
            id: true,
          },
        },
        attributes: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    });

    if (!category) {
      throw new HttpError(404);
    }

    res.json(category);
  })
  .patch(async (req, res) => {
    const id = z.string().uuid().parse(req.query.id);
    const data = UpdateSchema.parse(req.body);

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new HttpError(404);
    }

    res.json(
      await prisma.category.update({
        where: {
          id,
        },
        data: {
          name: data.name,
        },
      })
    );
  })
  .delete(async (req, res) => {
    const id = z.string().uuid().parse(req.query.id);

    res.json(
      await prisma.category.delete({
        where: {
          id,
        },
      })
    );
  });
