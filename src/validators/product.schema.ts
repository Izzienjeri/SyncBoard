import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long.",
  }),
  description: z.string().optional(),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  stock: z.coerce.number().int().nonnegative({
    message: "Stock must be 0 or greater.",
  }),
});

export type ProductSchema = z.infer<typeof productSchema>;