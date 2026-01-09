import type { Product, NewProduct } from "@/type";
import prisma from "@/lib/prisma";

let products: Product[] = [
  { id: 1, name: "Product A", price: 100 },
  { id: 2, name: "Product B", price: 150 },
  { id: 3, name: "Product C", price: 200 },
];

function getNextId(): number {
  return products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
}

export const findAll = async (): Promise<Product[]> => {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error) {
    throw error;
  }
  return products;
};

export const findById = async (id: number): Promise<Product | undefined> => {
  return products.find((p) => p.id === id);
};

export const createProduct = async (data: NewProduct): Promise<Product> => {
  const newProduct: Product = { id: getNextId(), ...data };
  products.push(newProduct);
  return newProduct;
};

export const updateProduct = async (
  id: number,
  patch: Partial<NewProduct>
): Promise<Product | undefined> => {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx] = { ...products[idx], ...patch } as Product;
  return products[idx];
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const initial = products.length;
  products = products.filter((p) => p.id !== id);
  return products.length < initial;
};

export const __resetForTests = (data: Product[]) => {
  products = data;
};
