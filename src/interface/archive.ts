export interface IArchive {
  id: number;
  created_at: string;
  content: { [s: string]: string } | ArrayLike<unknown>
  time: string;
  page: string;
  subject: string;
  date: string;
  roasting_date: string;
}