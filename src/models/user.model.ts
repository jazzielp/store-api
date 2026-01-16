import { prisma } from "@/lib/prisma";
import type { NewUser } from "@/type";
import { hashPassword } from "@/lib/hashPassword";

export const findAllUser = async () => {
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

export const findByIdUser = async (id: number) => {
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

export const findByEmailUser = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

export const createUser = async (data: NewUser) => {
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

export const updateUser = async (id: number, patch: Partial<NewUser>) => {
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

export const deleteUser = async (id: number) => {
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
