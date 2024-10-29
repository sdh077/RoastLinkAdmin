'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { usePathname, useRouter } from "next/navigation"

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "이름을 입력해주세요.",
  }),
  shop: z.string().min(2, {
    message: "사업장 이름을 입력해주세요",
  }),
  shop_no: z.string(),
  address: z.string(),
  phone: z.string().min(2, {
    message: "연락처를 입력해주세요",
  }),
  description: z.string()
    .max(1000, {
      message: "최대 1000자 입니다.",
    }),

})

const ContactForm = ({ purpose }: { purpose: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      shop: "",
      shop_no: "",
      address: "",
      phone: "",
      description: `1. 머신
2. 그라인더
3. 정수필터 

사업장 평수 / 특이사항 / 주력상품 / 컨셉 등 `,
    },
  })
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // FormData를 사용하여 데이터를 전송
      const body = JSON.stringify({ ...data, purpose })
      const response = await fetch(`/api/contact`, {
        method: 'POST',
        body: body,
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const res = await response.json();
      if (res.data) {
        router.push(`${pathname}/confirm`)
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 p-10 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>대표자 성함</FormLabel>
                <FormControl>
                  <Input placeholder="대표자 성함을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>연락처</FormLabel>
                <FormControl>
                  <Input type="" placeholder="ex) 010-1234-5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사업장 이름</FormLabel>
                <FormControl>
                  <Input type="" placeholder="사업장 이름을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shop_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사업자 번호 (예비 창업자의 경우 오픈 예정일 기입)</FormLabel>
                <FormControl>
                  <Input type="" placeholder="사업자 번호를 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>사업자 소재지</FormLabel>
                <FormControl>
                  <Input type="" placeholder="사업장 소재지를 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상세 정보</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="전달 사항을 적어주세요"
                    className="h-48"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="max-w-40 ">샘플 신청</Button>
        </div>
      </form>
    </Form>
  )
}

export default ContactForm