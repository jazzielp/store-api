import { string, z } from "zod";

export const createProdcutSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: "Name is required",
      })
      .min(1, "Name cannot be empty"),
    price: z
      .number({
        message: "Price is required",
      })
      .nonnegative("Price cannot be negative"),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    price: z.number().nonnegative("Price cannot be negative").optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.preprocess((val) => {
      if (typeof val === "string" && val.trim() !== "") return Number(val);
      return val;
    }, z.number({ message: "Id is required" })),
  }),
});
