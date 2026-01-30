import { z } from "zod";

export const createBrandSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: "Name is required",
      })
      .min(1, "Name cannot be empty"),
    description: z.string().optional(),
  }),
});

export const updateBrandSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    description: z.string().optional(),
  }),
});

export const getBrandSchema = z.object({
  params: z.object({
    id: z.preprocess((val) => {
      if (typeof val === "string" && val.trim() !== "") return Number(val);
      return val;
    }, z.number({ message: "Id is required" })),
  }),
});
