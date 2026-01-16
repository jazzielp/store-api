import { string, z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string({
      message: "Email is required",
    }),
    password: z
      .string({
        message: "Password is required",
      })
      .min(6, "Password must be at least 6 characters long"),
  }),
});
