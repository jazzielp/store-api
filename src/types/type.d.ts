export type Product = {
  id: number;
  description: string;
  name: string;
  price: number;
};
export type NewProduct = {
  name: string;
  description: string;
  price: number;
  brandId?: number;
};

export type Brand = {
  id: number;
  name: string;
  description: string;
};
export type NewBrand = { name: string; description?: string };

export type User = {
  id: number;
  email: string;
  password: string;
  fullname: string;
};
export type NewUser = { fullname: string; email: string; password: string };

export type Login = {
  email: string;
  password: string;
};
