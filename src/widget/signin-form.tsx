"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
// import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export function SigninForm() {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const supabase = createClient()
  const FormSchema = z.object({
    email: z.string().min(2, {
      message: "email must be at least 2 characters.",
    }),
    password: z.string().min(2, {
      message: "password must be at least 2 characters.",
    }),
    remember: z.boolean().default(false).optional()

  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  })
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    try {

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email + "@faabscoffee.com",
        password: data.password
      })
      if (error) {
        toast({
          title: '로그인에 실패 했습니다'
        })
        return
      }
      const session = await supabase.auth.getUser()
      const res = await fetch(`/api/token`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: session.data.user?.id
        })
      }).then(res => res.json())
      if (res.type === 3) {
        localStorage.setItem('id', res.id)
        localStorage.setItem('name', res.name)
        localStorage.setItem('type', res.type)
        window.location.href = '/'
        return
      }
      if (!res.shopId) {
        toast({
          title: '로그인에 실패 했습니다'
        })
        return
      }
      localStorage.setItem('name', res.name)
      localStorage.setItem('shopName', res.shopName)
      localStorage.setItem('shopId', res.shopId)
      localStorage.setItem('id', res.id)
      localStorage.setItem('shop_user_id', res.shopUserId)
      localStorage.setItem('type', res.type)
      localStorage.setItem('remember', data.remember ? data.email : '')
      window.location.href = '/'
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    const rememberId = localStorage.getItem('remember') ?? ''
    if (rememberId) {
      form.setValue('email', rememberId)
    }
    supabase.auth.getUser()
      .then(res => {
        if (res.data.user) {
          window.location.href = '/'
        } else {
          setChecking(false)
        }
      })
      .catch(() => setChecking(false))
  }, [])
  if (checking) return null

  return (

    <div className="container max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-black flex flex-col gap-8">

      <Link href={'/'} className="mx-auto flex justify-center my-6 ">
        <Image src='/logo.png' alt="logo" width={240} height={40} />
      </Link>
      <Form {...form}>
        <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input placeholder="아이디를 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="비밀번호을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex flex-row items-end gap-2 ">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    계정 정보 기억하기
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-8"
            type="submit"
            disabled={loading}
          >
            {loading ? '로그인 중' : '로그인'} &rarr;
            <BottomGradient />
          </button>

          {/* <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" /> */}

        </form>
      </Form>
    </div>
  );
}
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
