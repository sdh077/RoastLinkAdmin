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
  delivery: string | null;
  start_date: string
  box: number;
  memo: string
  invoice: string | null;
}
export interface OrderSub {
  id: number
  created_at: string
  custom_order_id: number
  box: number;
  box_type: string;
  box_items: number;
  fare: number;
  fare_add: number;
  fare_type: string
  invoice: string | undefined;
}
export interface Custom {
  id: number;
  created_at: string;
  name: string;
  address: string;
  rank: number
  tel: string;
  business_number: string
  business_user: string
}
export type Cart = { count: number, price: number, product: Sale }
export type OrderCustom = Order & { custom: Custom; custom_order_sub: OrderSub[] }
export type OrderShop = Order & { shop: Custom }
