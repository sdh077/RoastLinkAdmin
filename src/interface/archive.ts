export interface IArchive {
  id: number;
  created_at: string;
  content: { [s: string]: string | number | boolean }
  time: string;
  page: string;
  subject: string;
  date: string;
  roasting_date: string;
  name: string;
  shop_user: { name: string }
}