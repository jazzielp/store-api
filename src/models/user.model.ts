import { prisma } from "@/lib/prisma";
import type { User, NewUser } from "@/type";

// let users: User[] = [
//   {
//     id: 1,
//     username: "Jhon Milton",
//     email: "jhon@example.com",
//     password: "password123",
//   },
//   {
//     id: 2,
//     username: "Mike Tyson",
//     email: "mike@example.com",
//     password: "password456",
//   },
// ];

// function getNextId(): number {
//   return users.length > 0 ? Math.max(...users.map((p) => p.id)) + 1 : 1;
// }

export const findAll = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// export const findById = async (id: number): Promise<User | undefined> => {
//   return users.find((p) => p.id === id);
// };

export const createProduct = async (data: NewUser) => {
  try {
    const user = await prisma.user.create({
      data,
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// export const updateProduct = async (
//   id: number,
//   patch: Partial<NewUser>
// ): Promise<User | undefined> => {
//   const idx = users.findIndex((u) => u.id === id);
//   if (idx === -1) return undefined;
//   users[idx] = { ...users[idx], ...patch } as User;
//   return users[idx];
// };

// export const deleteProduct = async (id: number): Promise<boolean> => {
//   const initial = users.length;
//   users = users.filter((u) => u.id !== id);
//   return users.length < initial;
// };

// export const __resetForTests = (data: User[]) => {
//   users = data;
// };
