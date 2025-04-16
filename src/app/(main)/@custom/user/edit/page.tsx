import React from 'react'
import UserEditForm from './form'
import { createClient } from '@/lib/supabase/server'
import { ICustom } from '@/interface/custom'

const getUser = async () => {
  const supabase = await createClient()
  const session = await supabase.auth.getUser()
  return await supabase
    .from('custom')
    .select('*, shop_custom(*)', { count: 'estimated' })
    .eq('id', session.data.user?.id)
    .single<ICustom>()
}

const page = async () => {
  const { data } = await getUser()
  if (!data) return <></>
  return (
    <UserEditForm user={data} />
  )
}

export default page