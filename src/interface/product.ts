export type IProduct = {
  id: number
  created_at: string;
  name: string;
  eng_name: string;
  roasting: string;
  green: string;
  description: string;
  flavor: string;
  content: string;
  shipping_id: string;
  category_id: string;
  img: string;
  type: string;
  price: number;
  is_delete: boolean
}

export interface ICategory {
  id: number
  created_at: string
  title: string
  use_yn: boolean
  eng_title: string
  use_main: boolean
}

export interface ICategoryOption {
  id: number
  created_at: string;
  title: string;
  type: 'single' | 'multi' | 'select';
  use_yn: boolean
  goods_category_id: number
  content: string
}

export interface IProductOption {
  id: number
  goods_id: string
  goods_category_option_id: string;
  text: string
}