import type { Product, NewProduct } from "@/type";
import { prisma } from "@/lib/prisma";

// let products: any = [
//   { id: 1, name: "Product A", price: 100 },
//   { id: 2, name: "Product B", price: 150 },
//   { id: 3, name: "Product C", price: 200 },
// ];

export const findAll = async () => {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error) {
    throw error;
  }
};

export const findById = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (data: NewProduct) => {
  try {
    const { name, description, price } = data;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
      },
    });
    return product;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id: number, patch: Partial<NewProduct>) => {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: patch,
    });
    return product;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await prisma.product.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

export const __resetForTests = async (data: Product[]) => {
  try {
    await prisma.product.deleteMany();
    if (data && data.length) {
      await prisma.product.createMany({ data });
    }
  } catch (error) {
    throw error;
  }
};
