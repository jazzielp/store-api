import type { Brand, NewBrand } from "@/types/type";
import { prisma } from "@/lib/prisma";

export const findAll = async () => {
  try {
    const brands = await prisma.brand.findMany();
    return brands;
  } catch (error) {
    throw error;
  }
};

export const findById = async (id: number) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });
    return brand;
  } catch (error) {
    throw error;
  }
};

export const createBrand = async (data: NewBrand) => {
  try {
    const { name, description } = data;
    const brand = await prisma.brand.create({
      data: {
        name,
        description,
      },
    });
    return brand;
  } catch (error) {
    throw error;
  }
};

export const updateBrand = async (id: number, patch: Partial<NewBrand>) => {
  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: patch,
    });
    return brand;
  } catch (error) {
    throw error;
  }
};

export const deleteBrand = async (id: number) => {
  try {
    const brand = await prisma.brand.delete({
      where: { id },
    });
    return { id: brand.id, name: brand.name };
  } catch (error) {
    throw error;
  }
};

export const __resetForTests = async (data: Brand[]) => {
  try {
    await prisma.brand.deleteMany();
    if (data && data.length) {
      await prisma.brand.createMany({ data });
    }
  } catch (error) {
    throw error;
  }
};
