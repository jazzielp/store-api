import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
    fullname: z.string().min(3),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    email: z.email().optional(),
    password: z.string().min(6).optional(),
    fullname: z.string().min(3).optional(),
  }),
});
