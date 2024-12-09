'use client'
import { useCreateQueryString } from '@/hooks/use-create-query-string'
import React from 'react'
import { Button } from './ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const TableFilter = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const q = params.get('q') ?? '요청'
  const queryString = useCreateQueryString()
  const handleQuery = (q: string) => {
    router.push(`${pathname}?${queryString('q', q)}`)
  }
  return (
    <div className='flex gap-1'>
      <Button variant={'ghost'} active={q === '요청' ? 'on' : 'default'} onClick={() => handleQuery('요청')}>요청</Button>
      <Button variant={'ghost'} active={q === '완료' ? 'on' : 'default'} onClick={() => handleQuery('완료')}>완료</Button>
      <Button variant={'ghost'} active={q === '보류' ? 'on' : 'default'} onClick={() => handleQuery('보류')}>보류</Button>
      <Button variant={'ghost'} active={q === '전체' ? 'on' : 'on'} onClick={() => handleQuery('전체')}>전체</Button>
    </div>
  )
}

export default TableFilter