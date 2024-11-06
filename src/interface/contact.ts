export type Contact = {
  id: number,
  created_at: string;
  name: string,
  phone: string,
  description: string,
  purpose: 'sample' | 'tasting',
  shop: string,
  shop_no: string,
  address: string,
  bean: string[],
  memo: string;
  status: string;
}