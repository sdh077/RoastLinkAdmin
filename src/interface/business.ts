import { IProduct } from "./product";

export interface Sale {
  id: number
  user_id: string
  product_id: number
  sale_record: number;
  price: number;
  product: IProduct
}

export interface Order {
  id: number
  created_at: string
  status: string;
  name: string
  price: number;
  products: Cart[];
  user_id: string;
  invoice: string | null;
  delivery: string | null;
  start_date: string
}
export interface Custom {
  id: number;
  name: string;
  address: string;
  rank: number
}
export type Cart = { count: number, price: number, product: Sale }
export type OrderCustom = Order & { custom: Custom }