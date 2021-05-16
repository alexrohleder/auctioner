import { AttributeType } from ".prisma/client";
import z from "../lib/validation";

const name = z.string().nonempty().max(60);
const slug = z.string().nonempty().max(60);
const type = z.string().refine((type) => AttributeType[type] !== undefined);
const options = z.array(z.object({ name: z.string().nonempty() }));

// used to identify the custom_error in front-end
export const ShouldHaveAtLeast2Options = "Should have at least 2 options";

export const AttributeInsertSchema = z
  .object({
    name,
    slug,
    type,
    isRequired: z.boolean(),
    options,
  })
  .refine(
    (data) =>
      data.type === AttributeType.DROPDOWN ? data.options.length >= 2 : true,
    { message: ShouldHaveAtLeast2Options, path: ["options"] }
  );

export const AttributeUpdateSchema = z.object({
  name,
  isRequired: z.boolean(),
});

export const AttributeSelectSchema = z.object({
  name: name.optional(),
  type: type.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  take: z.number().int().min(1).max(100).optional(),
  skip: z.number().int().min(1).optional(),
});
