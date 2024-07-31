import * as z from "zod";

export const registerSchema = z.object({
  fullname: z
    .string()
    .min(1, {
      message: "Fullname is required",
    })
    .max(150, {
      message: "Fullname must be less than 150 characters.",
    })
    .refine((data) => data.length >= 3, {
      message: "Fullname must be at least 3 characters.",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email." }),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .refine((data) => data.length >= 6, {
      message: "Password must be at least 6 characters.",
    }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email." }),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .refine((data) => data.length >= 6, {
      message: "Password must be at least 6 characters.",
    }),
});
