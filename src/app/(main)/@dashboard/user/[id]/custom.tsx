'use client'

import { Button } from "@/components/ui/button"
import { IProduct } from "@/interface/product"
import { createClient } from "@/lib/supabase/client"
import { useParams } from "next/navigation"
import { useState } from "react"

export const AllProduct = ({ products }: { products: IProduct[] }) => {
  return (
    <div>
      {products.map(product =>
        <div key={product.id}>{product.name}</div>
      )}
    </div>
  )
}

export const ChoiceProduct = ({ products }: { products: IProduct[] }) => {
  return (
    <div>
      {products.map(product =>
        <div key={product.id}>{product.name}</div>
      )}
    </div>
  )
}


export function ProductSelector({ products }: { products: IProduct[] }) {
  const { id } = useParams<{ id: string; }>()
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);

  const handleSelect = (product: IProduct) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemove = (productId: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const addProducts = async () => {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('custom_price')
      .insert(selectedProducts.map(p => ({
        product_id: p.id,
        user_id: id
      })))
    console.log(data, error)
  }

  return (
    <div className="flex gap-4 p-4">
      {/* 왼쪽 박스 */}
      <div className="w-1/2 p-4 border border-gray-300 rounded-lg">
        <h2 className="text-lg font-bold mb-2">상품 목록</h2>
        <ul>
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between p-2 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(product)}
            >
              <span>{product.name}</span>
              <button className="px-2 py-1 text-sm bg-blue-500 text-white rounded">
                추가
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 오른쪽 박스 */}
      <div className="w-1/2 p-4 border border-gray-300 rounded-lg">
        <div className="h-full">
          <h2 className="text-lg font-bold mb-2">선택된 상품</h2>
          {selectedProducts.length === 0 ? (
            <p className="text-gray-500">선택된 상품이 없습니다.</p>
          ) : (
            <ul>
              {selectedProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between p-2 border-b"
                >
                  <span>{product.name}</span>
                  <button
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                    onClick={() => handleRemove(product.id)}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={addProducts}>할당하기</Button>
        </div>
      </div>
    </div>
  );
}
