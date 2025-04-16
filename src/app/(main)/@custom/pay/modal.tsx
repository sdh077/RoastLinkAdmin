'use client'
import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EstimateModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">견적서</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <Quotation />
      </DialogContent>
    </Dialog>
  )
}
export function DeliveryModal({ invoice }: { invoice: string | null }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!invoice}>배송추적</Button>
      </DialogTrigger>
      <DialogContent className="w-[1000px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <iframe src={`https://trace.cjlogistics.com/next/tracking.html?wblNo=${invoice}`} width={900} height={500}>
            </iframe>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )

}

const Quotation = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg border">
      <div className="text-right text-sm mb-2">25. 2. 7. 오후 2:46</div>
      <h1 className="text-3xl font-bold text-center mb-6">견적서</h1>

      <div className="border p-4 mb-4">
        <p><strong>담당자:</strong> 이준서님 귀하</p>
        <p><strong>견적일자:</strong> 2025년 02월 07일</p>
        <p><strong>견적금액:</strong> 148,500원 (부가세 포함)</p>
      </div>

      <div className="border p-4 mb-4 grid grid-cols-2 gap-4">
        <p><strong>상호:</strong> 타바론 코리아(주)</p>
        <p><strong>사업자번호:</strong> 106-87-23065</p>
        <p><strong>대표자:</strong> 박영준</p>
        <p><strong>주소:</strong> 서울특별시 강남구 학동로 562 47층</p>
        <p><strong>업태:</strong> 도소매</p>
        <p><strong>종목:</strong> 차, 커피 관련 제품 / 전자상거래</p>
        <p><strong>전화:</strong> 02-518-0819</p>
      </div>

      <table className="w-full border-collapse border text-left text-sm">
        <thead>
          <tr className="bg-gray-200 border">
            <th className="border p-2 text-center">번호</th>
            <th className="border p-2">품명</th>
            <th className="border p-2 text-center">제조사</th>
            <th className="border p-2 text-center">수량</th>
            <th className="border p-2 text-center">단가</th>
            <th className="border p-2 text-center">공급가액</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 text-center">1</td>
            <td className="border p-2">[사업자 전용] 크림슨 펀치 300g (+45000)</td>
            <td className="border p-2 text-center">-</td>
            <td className="border p-2 text-center">2</td>
            <td className="border p-2 text-right">13,300</td>
            <td className="border p-2 text-right">24,182</td>
          </tr>
          <tr>
            <td className="border p-2 text-center">2</td>
            <td className="border p-2">[사업자 전용] 얼 그레이 리저브 50티백 (+17200)</td>
            <td className="border p-2 text-center">-</td>
            <td className="border p-2 text-center">2</td>
            <td className="border p-2 text-right">45,000</td>
            <td className="border p-2 text-right">81,819</td>
          </tr>
          <tr>
            <td className="border p-2 text-center">3</td>
            <td className="border p-2">얼 그레이 리저브 벌크</td>
            <td className="border p-2 text-center">-</td>
            <td className="border p-2 text-center">1</td>
            <td className="border p-2 text-right">17,200</td>
            <td className="border p-2 text-right">15,637</td>
          </tr>
        </tbody>
      </table>

      <div className="border p-4 mt-4 text-right text-sm">
        <p><strong>상품금액:</strong> 135,002원</p>
        <p><strong>부가세:</strong> 13,498원</p>
        <p><strong>배송비:</strong> 0원</p>
        <p className="font-bold text-lg">합계: 148,500원</p>
      </div>

      <div className="border p-4 mt-4">
        <p><strong>입금 계좌:</strong> 기업은행 061-063962-04-013 (예금주: 타바론 코리아)</p>
      </div>
    </div>
  );
};