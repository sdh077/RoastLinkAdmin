import { createClient } from '@/lib/supabase/server'
import React from 'react'

const getProduct = async () => {
  const supabase = await createClient()
  return await supabase.from('product').select('*')
}

const page = async () => {
  const products = await getProduct()
  console.log(products)
  return (
    <div>page</div>
  )
}

export default page