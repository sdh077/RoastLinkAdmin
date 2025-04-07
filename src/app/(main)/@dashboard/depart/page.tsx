import { createClient } from '@/lib/supabase/server'
import { getUserFromToken } from '@/lib/utils';
import { cookies } from 'next/headers';
import React from 'react'
import { DepartCard } from './depart-card';
import { IDepart } from '@/interface/depart';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const getDefaultDepart = async () => {
  const supabase = await createClient()
  const session = await supabase.auth.getUser()
  return await supabase.from('shop').select('depart_default').eq('user_id', session.data.user?.id).single<{ depart_default: number }>()
}

const getDeparts = async () => {
  const supabase = await createClient()
  const token = (await cookies()).get("token")?.value;
  const shop = await getUserFromToken(token)
  return supabase.from('shop_depart').select('*').eq('shop_id', shop.id).eq('is_delete', false).returns<IDepart[]>()
}

const page = async () => {
  const { data: defaultDepart, error } = await getDefaultDepart()
  const { data: departs } = await getDeparts()
  return (
    <>
      <div className='grid md:grid-cols-3 gap-3'>
        {departs?.map(depart =>
          <DepartCard key={depart.id} depart={depart} isDefault={defaultDepart?.depart_default === depart.id} />
        )}
      </div>
      <div className='flex justify-end container'>
        <div>
          <Link href={'/depart/create'}>
            <Button>배송지 추가</Button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default page