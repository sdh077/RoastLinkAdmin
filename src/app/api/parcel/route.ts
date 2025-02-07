import { createClient } from "@/lib/supabase/server"
async function trackParcel(trackingNumber) {
  const url = `https://www.cjlogistics.com/ko/tool/parcel/tracking-deliveryDetail`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        '_csrf': '9547d681-f7db-441b-8dca-1bdf54afa30b',
        'paramBranchCd': '7795',
        'paramEmpId': '569582',
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 배송 조회 결과:", data);
  } catch (error) {
    console.error("❌ 오류 발생:", error);
  }
}

// ✅ 예제 송장 번호로 조회


export async function POST(request: Request) {
  trackParcel("689942415361");
  return Response.json({ a: 'res' })
}