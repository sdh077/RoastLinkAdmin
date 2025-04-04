'use client'
import { Contact } from '@/interface/contact'
import { Textarea } from "@/components/ui/textarea"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

const ContactEdit = ({ contact }: { contact: Contact }) => {
  const { toast } = useToast()
  const [memo, setMemo] = useState(contact.memo ?? '')
  const [status, setStaus] = useState(contact.status)
  const updateContactMemo = () => {
    const supabase = createClient('public')
    supabase.from('contact_business')
      .update({ 'memo': memo })
      .eq('id', contact.id)
      .then(res => {
        if (!res.error) toast({
          title: "수정이 완료되었습니다.",
        })
      })
  }
  const updateContactStatus = async (status: string) => {
    const { error } = await fetch('/api/contact', {
      method: 'PUT',
      body: JSON.stringify({ status, id: contact.id })
    }).then(res => res.json())

    console.log(error, contact.id)

    if (!error) {
      toast({
        title: "수정이 완료되었습니다.",
      })
      setStaus('완료')
    } else {
      toast({
        title: "수정이 실패했습니다",
        description: error.message
      })
    }
  }
  return (
    <div className='flex flex-col gap-8'>
      <Textarea value={memo} onChange={e => setMemo(e.target.value)} />
      <div className='flex flex-col gap-8'>
        <Button className='w-28 text-white' onClick={() => updateContactMemo()}>메모 수정</Button>
        <div className='flex gap-8'>
          {status === "요청" ?
            <>
              <Button variant={'secondary'} className='w-20 md:w-28' onClick={() => updateContactStatus('완료')}>완료하기</Button>
              <Button variant={'default'} className='w-20 md:w-28 text-white' onClick={() => updateContactStatus('보류')}>보류하기</Button>
            </> :
            <Button disabled className='w-20 md:w-28'>처리 완료</Button>
          }
        </div>
      </div>
    </div>
  )
}

export default ContactEdit