export type Product = {
  id: number;
  description: string;
  name: string;
  price: number;
};
export type NewProduct = { name: string; description: string; price: number };

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};
export type NewUser = { username: string; email: string; password: string };
