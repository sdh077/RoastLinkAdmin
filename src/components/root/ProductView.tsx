import { ProductProp3 } from '@/interface/product'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment, ReactNode } from 'react'

const ProductView = ({ children }: { children: ReactNode }) => {
  return (
    <ul className="home-items grid grid-cols-1 gap-12 py-8 md:grid-cols-2 xl:grid-cols-4 ">
      {children}
    </ul>
  )
}

const ProductRow = ({ item }: { item: ProductProp3 }) => {
  return (
    <li className="home-item relative flex flex-col gap-6 " key={item.id}>
      <div className="relative w-full h-[380px] overflow-hidden">
        <Image
          className=" w-full object-cover object-center "
          loading="lazy"
          alt="Bolivia: Brenda Palli"
          fill
          src={item.img}
        />
      </div>
      <div className="underline-black flex flex-col gap-6 min-h-20">
        <div className="font-semibold">
          {item.name}
          <div className="font-thin">{item.price}원</div>
        </div>
      </div>
      <div className='min-h-16'>
        {item.description}
      </div>
      <div className="min-h-16 flex flex-col gap-2">
        {item.product_option.map(selection =>
          <div className="flex justify-between " key={selection.id}>
            <div className="w-20">{selection.category_option.title}</div>
            <div className="">{selection.content}</div>
          </div>
        )}
      </div>
      <div className="">
        <Link href={item.content ?? '/'} target='_blank'>
          <button
            type="button"
            tabIndex={0}
            className="ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full rounded-none bg-black text-white"
            data-button-root=""
          >

            스마트스토어
          </button>
        </Link>
      </div>
    </li>
  )
}

export { ProductView, ProductRow }