import { prisma } from "@/lib/prisma";
import type { User, NewUser } from "@/type";
import { hashPassword } from "@/lib/hashPassword";

export const findAll = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const findById = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const createProduct = async (data: NewUser) => {
  try {
    const hashedPassword = (await hashPassword(data.password)) as string;
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateProduct = async (id: number, patch: Partial<NewUser>) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return null;
    }

    let updatedData: Partial<NewUser> = { ...patch };

    if (patch.password) {
      const hashedPassword = (await hashPassword(patch.password)) as string;
      updatedData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// export const __resetForTests = (data: User[]) => {
//   users = data;
// };
