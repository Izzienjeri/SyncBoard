import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long.",
  }),
  description: z.string().optional(),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) || 0 : val))
    .refine((val) => val > 0, {
      message: "Price must be a positive number.",
    }),
});

export type CourseSchema = z.infer<typeof courseSchema>;
