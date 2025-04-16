import jwt from "jsonwebtoken";
import Cookies from 'js-cookie'
import { redirect } from "next/navigation"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "./supabase/client"
import { Order, OrderCustom } from "@/interface/business";
import { toast } from "@/hooks/use-toast";
import { PostgrestError } from "@supabase/supabase-js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const updateStatus = async (id: number | number[], updateForm: object, table = 'custom_order') => {
  const supabase = await createClient()
  let q = supabase
    .from(table)
    .update(updateForm)
  if ('number' === typeof id) q = q.eq('id', id)
  else q = q.in('id', id)
  const { error } = await q

  if (error) return { result: false, error }
  else return { result: true, error: null }
}


const SECRET_KEY = process.env.NEXTAUTH_SECRET!; // 실제 프로젝트에서는 .env 파일 사용

export const getUserFromToken = async (token: string | undefined) => {
  if (!token) {
    redirect("/auth/signin");
  }

  try {
    return jwt.verify(token, SECRET_KEY) as { id: number | string };
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    redirect("/auth/signin");
  }
};

export const getOrderNumber = (order: Order) => {
  return order.created_at?.slice(0, 10).replaceAll('-', '') + order.id
}

export function makeYYYYMMDD(date: Date) {
  const year = date.getFullYear(); // 월
  const month = (date.getMonth() + 1).toString().padStart(2, '0');  // 일
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`
}

export function toastResult(error: PostgrestError | null, success: string, fail: string) {
  if (error) toast({
    title: fail,
    description: error.message
  })
  else toast({
    title: success
  })
}