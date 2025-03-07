export type IProduct = {
  id: number
  created_at: string;
  name: string;
  eng_name: string;
  description: string;
  content: string;
  category_id: number;
  img: string;
  type: string;
  price: number;
  price_sale: number;
  is_delete: boolean
}

export interface ICategory {
  id: number
  created_at: string
  title: string
  use_yn: boolean
  eng_title: string
  display: string
  use_main: boolean
}

export interface ICategoryOption {
  id: number
  created_at: string;
  title: string;
  type: 'radio' | 'checkbox' | 'input';
  use_yn: boolean
  category_id: number
  content: string
}

export interface ICategoryOptionItem {
  id: number
  created_at: string;
  category_option_id: number
  content: string
  use_yn: boolean
}

export interface IProductOption {
  id: number
  category_option_id: number;
  product_id: number;
  content: string
  price: number
  price_sale: number
  is_delete: boolean
  is_view: boolean
}