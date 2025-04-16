import { IDepart } from "@/interface/depart";
import { createClient } from "@/lib/supabase/server";
import { getUserFromToken } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient()
  const token = (await cookies()).get("token")?.value;
  const shop = await getUserFromToken(token)
  const { data, error } = await supabase.from('shop_depart').select('*').eq('shop_id', shop.id).returns<IDepart[]>()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const body = await req.json();
    const { data, error } = await supabase.auth.signUp({
      email: `${body.id}@faabscoffee.com`,
      password: `${body.password}`,
    })

    if (!data.user) {
      return NextResponse.json({ error: "토큰이 없습니다." }, { status: 401 });
    }

    const { error: errorUser } = await supabase.from("shop_user").insert([{ user_id: data.user?.id, shop_id: 1, name: body.name, type: body.type }]);

    if (errorUser) {
      return NextResponse.json({ error: errorUser.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
