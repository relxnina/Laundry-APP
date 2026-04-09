export type Product = {
  id: string;
  name: string;
  price: number;
  type: "weight" | "item";
  isActive: boolean;
  createdAt?: any;
  slug: string;
};