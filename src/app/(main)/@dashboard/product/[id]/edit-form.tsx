'use client'
import { ProductForm } from '@/components/product/product-form'
import { IProduct } from '@/interface/product'

export default function EditForm({ product }: { product: IProduct }) {
  return <ProductForm initial={product} />
}
