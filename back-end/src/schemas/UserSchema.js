import { z } from "zod";

export const createUserSchema = z.object({
  first_name: z.string().min(2, "First name too short"),
  last_name: z.string().min(2, "Last name too short"),
  email: z.email("Invalid email format"),
  password: z.string().min(2, "Password must be at least 6 characters"),
  height: z.number().optional(),
  birth_date: z.date().optional()
});
