import Heading from '@/components/heading'
import ContactForm from '@/widget/contact-form'
import React from 'react'

const Page = () => {
  return (
    <div className='container'>
      <Guide />
      <ContactForm purpose='sample' />
    </div>
  )
}
function Guide() {
  return (
    <section className="py-16 px-8 border-dashed border-b-2 border-primary">
      <div className="container flex flex-col items-center gap-4">
        <Heading>샘플 신청</Heading>
        <div className="flex flex-col justify-center items-start w-full">
          <div>창업예비자 ,사업장 운영자 분들께 납품 원두 샘플을 보내드립니다. </div>
          <div> 택배비 3,500원</div>
          <div> 하나은행 620-189537-152 신정주 입금</div>
        </div>
        <div className="flex flex-col justify-center items-start w-full">
          <div className='color-text'>•무료 샘플 신청100g </div>
          <div className='color-text'>•유로 샘플 500g (사업자 가격에 제공) </div>
        </div>
      </div>
    </section>
  )
}
export default Page