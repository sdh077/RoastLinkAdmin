'use client'
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
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { BsFillStarFill } from "react-icons/bs";

export function DepartCard({ depart, isDefault }: { depart: IDepart, isDefault: boolean }) {
  const router = useRouter()
  const defaultDepart = async () => {
    const supabase = createClient()
    const session = await supabase.auth.getUser()
    const { data, error } = await supabase.from('shop')
      .update({ 'depart_default': depart.id })
      .eq('user_id', session.data.user?.id)
    if (error) {
      toast({
        title: '설정 실패',
        description: error.message
      })
    } else {
      toast({
        title: '설정 되었습니다',
      })
      router.refresh()
    }
  }
  const deleteDepart = async () => {
    const supabase = createClient()
    const session = await supabase.auth.getUser()
    const { data, error } = await supabase.from('shop')
      .update({ 'is_delete': true })
      .eq('user_id', session.data.user?.id)
    if (error) {
      toast({
        title: '배송지 삭제 실패',
        description: error.message
      })
    } else {
      toast({
        title: '배송지가 삭제 되었습니다',
      })
      router.refresh()
    }
  }
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            {depart.name}{isDefault ? <BsFillStarFill /> : <></>}
          </div>
        </CardTitle>
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
        <Button disabled={isDefault} onClick={deleteDepart} variant="outline">삭제</Button>
        <Button disabled={isDefault} onClick={defaultDepart}>기본으로 설정</Button>
      </CardFooter>
    </Card>
  )
}
