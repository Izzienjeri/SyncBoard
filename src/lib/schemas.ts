import { z } from "zod";

// --- UNCHANGED ---
export const userSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;


// --- NEW ---
export const subjectSchema = z.object({
  name: z.string().min(2, { message: "Subject name must be at least 2 characters." }),
  teacherIds: z.array(z.number()),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;
