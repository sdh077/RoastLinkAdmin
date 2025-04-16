'use client'
import { PwChage } from '@/components/main/pw-change'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import React from 'react'
import PasswordChange1 from './p1'
import ChangePassword2 from './p2'

const Page = () => {
  return (
    <PasswordChange1 />
    // <ChangePassword2 />
    // <PwChage />
  )
}

export default Page