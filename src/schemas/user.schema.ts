import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
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
    username: z.string().min(3).optional(),
    email: z.email().optional(),
    password: z.string().min(6).optional(),
  }),
});
