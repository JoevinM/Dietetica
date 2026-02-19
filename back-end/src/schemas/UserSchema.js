import { z } from "zod";

export const createUserSchema = z.object({
  first_name: z.string().trim().min(2, "First name too short"),
  last_name: z.string().trim().min(2, "Last name too short"),

  email: z
    .string()
    .trim() // avoid blank spaces
    .lowercase()
    .email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),

  height: z
    .number()
    .min(50, "Height too small")
    .max(250, "Height too tall")
    .optional(),

  birth_date: z
    .coerce
    .date()
    .optional()
}).strict();

export const updateUserSchema = createUserSchema
  .omit({ password: true, email: true })    // no password or email in update
  .partial()                                // everything is optionnal
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided"
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email format"),

  password: z
    .string()
    .min(1, "Password is required")
}).strict();

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),

  confirmPassword: z
    .string()
    .min(1, "Password confirmation is required"),
})
.strict()
.superRefine((data, ctx) => {

  // verify newPassword = confirmPassword
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "Passwords do not match"
    });
  }

  // can't put the same password
  if (data.currentPassword === data.newPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["newPassword"],
      message: "New password must be different from current password"
    });
  }

});
