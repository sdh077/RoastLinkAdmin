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
        <Heading>
          파브스 커피 원두 납품 상담신청
        </Heading>
        <div className="flex flex-col justify-center items-start w-full">
          <div>창업예비자, 사업장 운영자, 회사 원두 납품 등</div>
          <div>파브스 커피의 파트너가 되어보세요!</div>
          <div>스페셜티 커피 원두로 커피 맛을 한층 더 업그레이드 시켜보세요! </div>
          <div className='color-text'>카페쇼 종료 후 순차적으로 연락드립니다 </div>
        </div>
      </div>
    </section>
  )
}
export default Page
