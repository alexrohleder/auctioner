import z from "../lib/validation";

export enum LoginFrom {
  DASHBOARD,
  STOREFRONT,
}

const isLocalURL = true; // check if we are calling from dashboard

export const LoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(4),
    organizationId: z.string().uuid().optional(),
    from: z
      .number()
      .refine((from) => Object.values(LoginFrom).includes(from))
      .refine((from) => (from === LoginFrom.DASHBOARD ? isLocalURL : true)),
  })
  .refine(
    (data) =>
      data.from === LoginFrom.STOREFRONT ? !!data.organizationId : true,
    { message: "organizationId is required", path: ["organizationId"] }
  );
