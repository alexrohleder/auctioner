import { Prisma } from ".prisma/client";
import prisma from "../lib/db";

const select = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  attributes: {
    select: {
      id: true,
      name: true,
      type: true,
      isRequired: true,
      options: true,
    },
  },
};

export const getCategory = async (id: string) =>
  prisma.category.findUnique({
    where: {
      id,
    },
    select,
  });

export const getCategories = async ({
  where,
  orderBy = { createdAt: Prisma.SortOrder.desc },
  take = 10,
  skip,
}: {
  where: Prisma.CategoryWhereInput;
  orderBy?: Prisma.CategoryOrderByInput;
  take: number;
  skip?: number;
}) =>
  prisma.category.findMany({
    select,
    where,
    orderBy,
    take,
    skip,
  });

export const createCategory = async (
  data: Prisma.XOR<
    Prisma.CategoryCreateInput,
    Prisma.CategoryUncheckedCreateInput
  >
) =>
  prisma.category.create({
    data,
    select,
  });

export const updateCategory = async (
  id: string,
  data: Prisma.XOR<
    Prisma.CategoryUpdateInput,
    Prisma.CategoryUncheckedUpdateInput
  >
) =>
  prisma.category.update({
    where: {
      id,
    },
    data,
    select,
  });

export const deleteCategory = async (id: string) =>
  prisma.category.delete({
    where: {
      id,
    },
    select,
  });
