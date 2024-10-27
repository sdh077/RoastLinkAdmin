import { Button } from "@/components/ui/button";
import Image from "next/image";


export default function Home() {
  return (
    <main>
      <Hero />
      <Second />
      <Footer />
    </main>
  );
}


function Hero() {
  return (
    <section className="py-16 border-dashed border-b-2 border-primary">
      <div className="container flex flex-col items-center gap-4">
        <div className="flex flex-col justify-center items-center">
          <div>매장에서 핸드드립을 시작해 보고 싶어요.</div>
          <div>파브스 커피 원두 납품  상담을 예약하고</div>
          <div>100그람 샘플 쿠폰을 받아보세요.</div>
        </div>
        <div className="flex flex-col justify-center items-center pt-4 w-fit pb-1 px-2 border-2 border-primary text-sm">
          <div>2024 SEOUL CAFE SHOW</div>
          <div>FAABS</div>
          <div>100G SAMPLE COFFEE BEAN</div>
          <div>COUPON</div>
          <Button>CLICK</Button>
        </div>
      </div>
    </section>
  )
}

function Second() {
  const sub = "text-sm bg-[#EEE7DC] px-2 rounded-md"
  return (
    <section className="py-16 border-dashed border-b-2 border-primary">
      <div className="container flex flex-col items-center gap-4">
        <div className="flex flex-col justify-center items-center">
          <div>&quot;매장에서 핸드드립을 시작해 보고 싶어요.&quot;</div>
          <div className={sub}>싱글 오리진 200g 부터 납품 가능한 파브스 커피 원두</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div>&quot;소량 납품도 대량 납품도 걱정 없어요.&quot;</div>
          <div className={sub}>블렌드 1kg 부터 납품 가능한 파브스 커피 원두</div>
          <div className={sub}>월 블렌드 50kg 이상 발주 시 싱글오리진 1kg 증정</div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <section className="py-16">
      <div className="container flex flex-col justify-center items-center">
        <Image src="/fafago.png" alt="파파고" width={248} height={350} />
        <div className="text-xs">
          ENG
        </div>
        <div className="text-xs">
          KOR
        </div>
      </div>
    </section>
  )
}