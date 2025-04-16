export interface ICustom {
  id: string;
  created_at: string;
  address: string;
  rank: number;
  name: string;
  business_number: string;
  business_user: string;
  tel: string;
  shop_custom: IShopCustom[]
}
export interface IShopCustom {
  id: number;
  use_yn: boolean
  shop_id: number
  custom_id: string;
  created_at: string;
}
