import { createClient } from "@/lib/supabase/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]"

export async function GET() {
  const session = await getServerSession(authOptions)
  console.log(session)
  const userId = session?.user?.id
  if (!userId) return Response.json({ error: 'no login' })
  const supabase = await createClient()
  const { data, error } = await supabase.from('profile').select('*').eq('user_id', userId)

  return Response.json({ data, error })
}