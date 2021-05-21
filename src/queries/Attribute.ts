import { Prisma } from ".prisma/client";
import prisma from "../lib/db";

const select = {
  id: true,
  name: true,
  slug: true,
  isRequired: true,
  createdAt: true,
  updatedAt: true,
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
};

export const getAttribute = async (id: string) =>
  prisma.attribute.findUnique({
    where: {
      id,
    },
    select,
  });

export const getAttributes = async ({
  where,
  orderBy = { createdAt: Prisma.SortOrder.desc },
  take = 10,
  skip,
}: {
  where: Prisma.AttributeWhereInput;
  orderBy?: Prisma.AttributeOrderByInput;
  take: number;
  skip?: number;
}) =>
  prisma.attribute.findMany({
    select,
    where,
    orderBy,
    take,
    skip,
  });

export const createAttribute = async (
  data: Prisma.XOR<
    Prisma.AttributeCreateInput,
    Prisma.AttributeUncheckedCreateInput
  >
) =>
  prisma.attribute.create({
    data,
    select,
  });

export const updateAttribute = async (
  id: string,
  data: Prisma.XOR<
    Prisma.AttributeUpdateInput,
    Prisma.AttributeUncheckedUpdateInput
  >
) =>
  prisma.attribute.update({
    where: {
      id,
    },
    data,
    select,
  });

export const deleteAttribute = async (id: string) => {
  // todo: replace this by ON DELETE CASCADE when prisma support it
  await Promise.all([
    prisma.auctionAttribute.deleteMany({
      where: {
        attributeId: id,
      },
    }),
    prisma.attributeOption.deleteMany({
      where: {
        attributeId: id,
      },
    }),
  ]);

  return prisma.attribute.delete({
    where: {
      id,
    },
    select,
  });
};
