'use client'
import { User } from '@/interface/user'
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

const useFetchUser = () => {
  const [user, setUser] = React.useState<User>({ id: 0, name: '', user_id: '', email: '' })
  const supabase = createClient()
  useEffect(() => {
    async function renewUser() {
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return setUser({ id: -1, name: '', user_id: '', email: '' })
      const { data } = await supabase.from('shop').select('*').eq('user_id', user.user.id).single()
      setUser({ ...data })
    }
    renewUser()
  }, [])
  const signOut = async () => {
    await supabase.auth.signOut()
  }
  return { user, signOut }
}

export default useFetchUser