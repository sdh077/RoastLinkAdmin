'use client'
import { Input } from '@/components/ui/input'
import { IEmployee } from '@/interface/employee'
import React, { useState } from 'react'

const EmployeeEdit = ({ employee }: { employee: IEmployee }) => {
  const [name, setName] = useState(employee.name)
  return (
    <div>
      {employee.email}
      <Input value={name} onChange={e => setName(e.target.value)} />
    </div>
  )
}

export default EmployeeEdit