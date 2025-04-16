import SectionTitle from '@/components/root/SectionTitle'
import { Button } from '@/components/ui/button'
import { Custom } from '@/interface/business'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import React from 'react'

const getInfo = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase
    .from('custom')
    .select('*')
    .eq('id', user.user?.id)
    .single<Custom>()
}

const page = async () => {
  const { data, error } = await getInfo()
  if (!data) return <></>
  return (
    <div>
      <SectionTitle>
        <div className='flex justify-between'>
          <div>
            기본 정보 관리
          </div>
          <div>
            <Link href={'/edit'}>
              <Button>수정</Button>
            </Link>
          </div>
        </div>
      </SectionTitle>
      <div className='flex flex-col gap-8 my-8'>

        <div>생성일: {data?.created_at?.slice(0, 10)}</div>
        <div>배송지: {data.address}</div>
        <div>사업자 번호: {data.business_number}</div>
        <div>사업자 이름: {data.business_user}</div>
        <div>연락처: {data.tel}</div>
      </div>
    </div>
  )
}

export default page