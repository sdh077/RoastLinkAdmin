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
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "토큰이 없습니다." }, { status: 401 });
    }
    const shop = await getUserFromToken(token);

    const { error } = await supabase.from("shop_depart").insert([{ ...body, shop_id: shop.id }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Depart 추가 오류:", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
