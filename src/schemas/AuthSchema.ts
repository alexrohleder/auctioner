import z from "../lib/validation";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
