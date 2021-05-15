import { AttributeType, Prisma } from ".prisma/client";
import api from "../../../../lib/api";
import prisma from "../../../../lib/db";
import z from "../../../../lib/validation";

const SelectSchema = z.object({
  name: z.string().optional(),
  type: z
    .string()
    .optional()
    .refine((type) => (type ? AttributeType[type] !== undefined : true)),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  take: z.number().int().min(1).max(100).optional(),
  skip: z.number().int().min(1).optional(),
});

const InsertSchema = z.object({
  name: z.string(),
  slug: z.string(),
  type: z.string().refine((type) => AttributeType[type] !== undefined),
  options: z.array(z.object({ name: z.string() })).optional(),
});

export default api()
  .get(async (req, res) => {
    const { take = 10, skip, ...data } = SelectSchema.parse(req.query);

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=1200, stale-while-revalidate=600"
    );

    res.json(
      await prisma.attribute.findMany({
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
          options: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        where: {
          name: data.name,
          type: data.type ? AttributeType[data.type] : undefined,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        take,
        skip,
      })
    );
  })
  .post(async (req, res) => {
    const data = InsertSchema.parse(req.body);

    const payload: Prisma.AttributeCreateArgs = {
      data: {
        name: data.name,
        slug: data.slug,
        type: AttributeType[data.type],
        isRequired: true,
        isFilterable: true,
      },
    };

    if (data.options) {
      payload.data.options = {
        createMany: {
          data: data.options,
        },
      };
    }

    res.json(await prisma.attribute.create(payload));
  });
