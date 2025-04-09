import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXTAUTH_SECRET!; // ⚠️ 실제 프로젝트에서는 .env 파일에서 관리할 것!

export async function POST(req: Request) {
  const { user_id } = await req.json();
  const supabase = await createClient()

  const { data: shop } = await supabase.from('shop_user')
    .select('*, shop(*)')
    .eq('user_id', user_id)
    .single()
  if (shop) {
    const token = jwt.sign(shop, SECRET_KEY, { expiresIn: "72h" });

    return new NextResponse(JSON.stringify({ success: true, type: shop.type, id: shop.user_id, name: shop.name, shopId: shop.shop_id, shopName: shop.shop.name, shopUserId: shop.id }), {
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Secure`,
      },
    });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
