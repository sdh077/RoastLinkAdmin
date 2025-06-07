import { createClient } from '@/lib/supabase/server'
import React from 'react'
import Heading from '@/components/heading'
import { StatusFilter } from '@/components/status-filter'
import { OrderCustom } from '@/interface/business'
import { cookies } from "next/headers";
import { getUserFromToken } from '@/lib/utils'
import { IEmployee } from '@/interface/employee'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import EmployeeEdit from './employee-edit'

const getEmployee = async (status: string = '0') => {
  const supabase = await createClient()
  let q = supabase.from('shop_user').select('*')
  const type = Number(status)
  if (type) q = q.eq('type', type)
  return await q
    .returns<IEmployee[]>()
}
const getUsers = async (userIds: string[]) => {
  const supabase = await createClient('auth')
  return await supabase
    .from('users') // auth.users 테이블
    .select('id, email')
    .in('id', userIds)
}
const statusType = [
  '전체',
  '직원',
  '관리자',
  '퇴사직원'
]
const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { status } = await searchParams
  const { data: employees, error } = await getEmployee(status as string)
  const userIds = employees?.map(u => u.user_id)

  const { data: authUsers, error: authError } = await getUsers(userIds!)
  console.log(authUsers, authError)
  const mergedEmployees = employees?.map(user => ({
    ...user,
    email: authUsers?.find(auth => auth.id === user.user_id)?.email || null
  }))

  return (
    <div>
      <div className='flex justify-between'>
        <Heading>직원관리</Heading>
        <div className='flex gap-8'>
          <Link href={'/employee/create'}>
            <Button>직원 추가</Button>
          </Link>
          <StatusFilter statusType={statusType} />
        </div>
      </div>
      {mergedEmployees?.map(employee =>
        <div key={employee.id}><EmployeeEdit employee={employee} /></div>
      )
      }
    </div>
  )
}

export default page