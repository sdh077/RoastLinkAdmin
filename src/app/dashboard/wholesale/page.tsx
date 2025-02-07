import { createClient } from '@/lib/supabase/server'
import React from 'react'

const getProduct = async () => {
  const supabase = await createClient()
  return await supabase.from('product').select('*')
}



const page = async () => {
  const products = await getProduct()

  return (
    <div>
      <iframe src='https://trace.cjlogistics.com/next/tracking.html?wblNo=689942415361' width={1000} height={1000}>

      </iframe>
    </div>
  )
}

export default page