import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXTAUTH_SECRET!;

export async function POST(req: Request) {
  const { user_id } = await req.json();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'business' } }
  )

  console.log('%csrc/app/api/token/route.ts:19 shop', 'color: #007acc;', user_id);
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
  } else {
    const { data: custom } = await supabase.from('custom')
      .select('*')
      .eq('id', user_id)
      .single()
    if (custom) {
      const token = jwt.sign(custom, SECRET_KEY, { expiresIn: "72h" });
      return new NextResponse(JSON.stringify({ success: true, type: 3, id: custom.id, name: custom.name }), {
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Secure`,
        },
      });
    }
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
