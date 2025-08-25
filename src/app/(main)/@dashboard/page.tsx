import { LineGraph } from '@/components/chart/temperature';
import './style.css'
import Announcements from "@/components/setting/Announcements";
import AttendanceChart from "@/components/setting/AttendanceChart";
import CountChart from "@/components/setting/CountChart";
import EventCalendar from "@/components/setting/EventCalendar";
import FinanceChart from "@/components/setting/FinanceChart";
import UserCard from "@/components/setting/UserCard";
import { createClient } from '@/lib/supabase/server';
import { IArchive } from '@/interface/archive';
import Image from 'next/image';
const getArchives = async (date: string | null) => {
  const supabase = await createClient()
  let q = supabase.from('archive').select('*, shop_user(*)').eq('page', 'espresso')
    .order('id', { ascending: false })
  if (date) q = q.eq('date', date)
  return await q
    .order('id', { ascending: true })
    .limit(10)
    .returns<IArchive[]>()
}
const AdminPage = async () => {
  const { data: archives } = await getArchives(null)
  const datasTemp = archives?.map(archive => ({ label: archive.created_at.slice(0, 10), data: Number(archive.content['온도']) })) ?? []
  const datasHumidity = archives?.map(archive => ({ label: archive.created_at.slice(0, 10), data: Number(archive.content['습도']) })) ?? []
  const datas = archives?.map(archive => ({
    name: archive.created_at.slice(0, 10),
    humidity: Number(archive.content['습도']),
    temp: Number(archive.content['온도'])
  })) ?? []
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
    </div>
  );
};

export default AdminPage;