'use client'
import { Button } from '@/components/ui/button'
import { ICategory } from '@/interface/product'
import { createClient } from '@/lib/supabase/client'
import React, { useState } from 'react'

const UpdateUse = ({ category }: { category: ICategory }) => {
  const [use, setUse] = useState(category.use_yn)
  const changeUse = async (category: ICategory) => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('goods_category')
      .update({ 'use_yn': !use })
      .eq('id', category.id)
      .select()
    if (!error) setUse(!use)
  }
  return (
    <Button onClick={() => changeUse(category)}>{use ? '판매중' : '판매중지'}</Button>
  )
}

export default UpdateUse