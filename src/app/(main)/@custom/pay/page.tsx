import { createClient } from "@/lib/supabase/server"

const getOrders = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  return await supabase.from('custom_order').select('*, custom(*)')
    .eq('user_id', user.user?.id)
    .eq('payed', false)
    .eq('status', '배송완료')
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { } = await params
  const { } = await searchParams
  const { data } = await getOrders()
  console.log(data)
  return (
    <div>
    </div>
  )
}