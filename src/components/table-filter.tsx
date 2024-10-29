'use client'
import { useCreateQueryString } from '@/hooks/use-create-query-string'
import React from 'react'
import { Button } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'

const TableFilter = () => {
  const router = useRouter()
  const pathname = usePathname()
  const queryString = useCreateQueryString()
  const handleQuery = (q: string) => {
    router.push(`${pathname}?${queryString('q', q)}`)
  }
  return (
    <div className='flex gap-1'>
      <Button variant={'ghost'} onClick={() => handleQuery('요청')}>요청</Button>
      <Button variant={'ghost'} onClick={() => handleQuery('완료')}>완료</Button>
      <Button variant={'ghost'} onClick={() => handleQuery('전체')}>전체</Button>
    </div>
  )
}

export default TableFilter