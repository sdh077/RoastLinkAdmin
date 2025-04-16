"use client";
import { Input } from "@/components/ui/input";

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
import { createClient } from "@/lib/supabase/client";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

export function PwChage() {
  const router = useRouter()
  const FormSchema = z.object({
    newPassword: z.string().min(2, {
      message: "password must be at least 2 characters.",
    }),
    newPasswordConfirm: z.string().min(2, {
      message: "password must be at least 2 characters.",
    }),

  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newPassword: "",
      newPasswordConfirm: "",
    },
  })
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.newPassword !== data.newPasswordConfirm) {
      toast({
        title: '비밀번호 변경 실패',
        description: '비밀번호가 다릅니다.'
      })
      return
    }
    const supabase = createClient()
    const res = await supabase.auth.updateUser({ password: data.newPassword })
    if (!res.error) {
      router.push('/')
    } else {
      toast({
        title: '비밀번호 변경 실패',
        description: res.error?.message
      })
    }
  };
  return (

    <div className="container max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input dark:bg-black flex flex-col gap-8">

      <Link href={'/'} className="mx-auto flex justify-center my-6 ">
        <Image src='/faabslogo.png' alt="logo" width={240} height={40} />
      </Link>
      <Form {...form}>
        <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>새로운 비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="새로운 비밀번호을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPasswordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>새로운 비밀번호 확인</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="한번 더 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-8"
            type="submit"
          >
            비밀번호 변경 &rarr;
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
