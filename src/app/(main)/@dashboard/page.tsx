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
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>
        <div className="w-full h-[500px]">
          <FinanceChart datas={datas} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;