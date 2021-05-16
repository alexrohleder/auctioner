import z from "../lib/validation";

export const AuctionUpdateSchema = z.object({
  name: z.string().nonempty(),
  attributes: z.array(z.object({ id: z.string().uuid() })),
});
