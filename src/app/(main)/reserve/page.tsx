import Heading from '@/components/heading'
import ContactForm from '@/widget/contact-form'
import React from 'react'

const Page = () => {
  return (
    <div className='container'>
      <Guide />
      <ContactForm purpose='tasting' />
    </div>
  )
}
function Guide() {
  return (
    <section className="py-16 px-8 border-dashed border-b-2 border-primary">
      <div className="container flex flex-col items-center gap-4">
        <Heading>테이스팅 타임 예약</Heading>
        <div className="flex flex-col justify-center items-start w-full">
          <div>테이스팅 상세 항목 : 블렌드  3종 & 디카페인 </div>
          <div> 에스프레소 /아메리카노/라떼 테이스팅</div>
          <div>싱글 오리진 ( 상담 후 필요 시 진행) </div>
        </div>
        <div className="flex flex-col justify-center items-start w-full">
          <div className='color-text'>1. 에스프레소 원두 라인업 1개인 경우 다크블렌드 / 모건타운 블렌드 샘플 : 상담 후 진행 </div>
          <div className='color-text'>2. 에스프레소 원두 라인업 2개 이상(그라인더 2대이상)인 경우 다크블렌드or모건타운블렌드or 홈타운 블렌드 or 디카페인 원두 : 상담 후 진행</div>
          <div className='color-text'>3. 핸드드립 싱글오리진 라인업</div>
        </div>
      </div>
    </section>
  )
}
export default Page