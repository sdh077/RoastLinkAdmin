'use client'
import { ProductForm } from '@/components/product/product-form'

export default function ProductCreatePage() {
  return (
    <div>
      <h1 className='text-xl font-bold mb-6'>상품 추가</h1>
      <ProductForm />
    </div>
  )
}
