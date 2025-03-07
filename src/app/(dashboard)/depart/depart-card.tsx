import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IDepart } from "@/interface/depart"

export function DepartCard({ depart }: { depart: IDepart }) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{depart.name}</CardTitle>
        <CardDescription>{depart.depart}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="leading-4 font-light grid w-full items-center gap-4">
          <div className="flex justify-between items-center">
            <div >보내는 분 전화번호</div>
            <div>{depart.tel}</div>
          </div>
          <div className="flex justify-between items-center">
            <div >운임구분</div>
            <div>{depart.fare_type}</div>
          </div>
          <div className="flex justify-between items-center">
            <div >박스타입</div>
            <div>{depart.box_type}</div>
          </div>
          <div className="flex justify-between items-center">
            <div >기본운임</div>
            <div>{depart.fare}</div>
          </div>
          <div className="flex justify-between items-center">
            <div >기타운임</div>
            <div>{depart.fare_add}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button variant="outline">삭제</Button>
        <Button>기본으로 설정</Button>
      </CardFooter>
    </Card>
  )
}
