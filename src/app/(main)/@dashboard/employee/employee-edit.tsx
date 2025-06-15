'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IEmployee } from '@/interface/employee'
import { createClient } from '@/lib/supabase/client'
import React, { useState } from 'react'
const editUser = async (id: number, name: string) => {
  const supabase = await createClient()
  return await supabase
    .from('shop_user')
    .update({ 'name': name })
    .eq('id', id)
}
const EmployeeEdit = ({ employee }: { employee: IEmployee }) => {
  const [name, setName] = useState(employee.name)
  return (
    <div className='flex gap-8 w-full'>
      <div className='w-40'>{employee.name}</div>
      <div className='flex gap-4'>
        <Input value={name} onChange={e => setName(e.target.value)} />
        <Button onClick={() => editUser(employee.id, name)}>변경</Button>
      </div>
    </div>
  )
}

export default EmployeeEdit