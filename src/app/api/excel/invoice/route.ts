import { OrderCustom } from "@/interface/business";
import { NextResponse } from "next/server";
import { utils, write } from "xlsx";

export async function POST(request: Request) {
  const { orders, depart, depart_dt } = await request.json()
  try {
    // **Excel 헤더 정의 (첫 번째 행)**
    const headers = [
      "No", "선택", "접수순서", "예약구분", "상태", "집화예정일자", "운송장번호", "집화예정점소",
      "보내는분", "보내는분전화번호", "운임구분", "박스타입", "수량", "내품수량", "기본운임",
      "기타운임", "운임합계", "고객주문번호", "배송계획점소", "받는분", "받는분전화번호",
      "받는분우편번호", "받는분주소", "상품코드", "상품명", "단품코드", "단품명",
      "배송메시지", "기타1", "기타2", "기타3", "기타4", "기타5", "기타6", "기타7", "기타8", "기타9", "기타10"
    ];

    // **데이터 샘플 (여러 개의 행 추가 가능)**
    const data = [
      [1, 0, 1, "일반", "접수", "2025-02-28", "", "서울은평증산(7320)", "파브스 커피(FAABS COFFEE)", "01029566164",
        "선불", "극소", 1, 1, 2900, 0, 2900, "2025022778832121", "대구북구검단(8760)", "정예원", "01051482357",
        "41523", "대구광역시 북구 검단로 64 (복현동, 복현보성타운) 103동 1207호", "", "홈타운 200g 500g 복숭아, 리치, 초콜릿",
        "", "무게: 200g / 분쇄도: 홀빈", "", "", "", "", "", "", "", "", ""],

      [2, 0, 2, "일반", "접수", "2025-02-28", "", "서울은평증산(7320)", "파브스 커피(FAABS COFFEE)", "01029566164",
        "선불", "극소", 1, 1, 2900, 0, 2900, "2025022717219171", "서울회기(1798)", "이은걸", "01088019656",
        "02453", "서울특별시 동대문구 경희대로 24 (회기동, 경희대학교) 스페이스 21 이과대학 6층", "", "모건타운 블렌드 500g, 1kg 밀크 초콜릿, 오렌지",
        "", "모건타운 블렌딩: 1kg 홀빈", "", "", "", "", "", "", "", "", ""],

      [3, 0, 3, "일반", "접수", "2025-02-28", "", "서울은평증산(7320)", "파브스 커피(FAABS COFFEE)", "01029566164",
        "선불", "극소", 1, 1, 2900, 0, 2900, "2025022513192931", "원미영업소(D23K)", "진지한", "01062476716",
        "14742", "경기도 부천시 소사구 경인로1185번길 46 (송내동) 202호", "", "커피1kg 복숭아, 리치향 원두 : 파브스 커피 홈타운 블렌드",
        "", "문앞에 놔주세요", "", "", "", "", "", "", "", "", ""],
    ];
    const datas = orders.map((order: OrderCustom, index: number) =>
      ([index + 1, 0, index + 1, '일반', '접수', depart_dt, "", depart.depart, depart.name, depart.tel, depart.fare_type, depart.box_type,])
    )
    // **워크시트 생성**
    // const worksheet = utils.aoa_to_sheet([headers, ...data]);

    // // **워크북 생성**
    // const workbook = utils.book_new();
    // utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // // **Excel 파일을 메모리에 저장**
    // const buffer = write(workbook, { type: "buffer", bookType: "xlsx" });

    // // **클라이언트로 파일 다운로드 반환**
    // return new NextResponse(buffer, {
    //   headers: {
    //     "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //     "Content-Disposition": "attachment; filename=taxform.xlsx",
    //   },
    // });
    return NextResponse.json({ error: "Excel 파일 생성 실패" }, { status: 500 });
  } catch (error) {
    console.error("Excel 생성 오류:", error);
    return NextResponse.json({ error: "Excel 파일 생성 실패" }, { status: 500 });
  }
}
