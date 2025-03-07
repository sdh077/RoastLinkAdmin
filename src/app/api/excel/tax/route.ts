import { NextResponse } from "next/server";
import { read, utils, write } from "xlsx";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    // public 폴더의 taxform.xlsx 파일 경로 지정
    const filePath = path.join(process.cwd(), "public", "taxform.xlsx");

    // 파일이 존재하는지 확인
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
    }

    // 엑셀 파일 읽기
    const buffer = await fs.readFile(filePath);
    const workbook = read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rowIndex = 6;
    const range = utils.decode_range(worksheet["!ref"]!);

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = { c: col, r: rowIndex }; // 각 열(col)에 대해 6번째 행(5번 인덱스) 지정
      const cellRef = utils.encode_cell(cellAddress);
      worksheet[cellRef] = { t: "s", v: `Col ${col + 1} - Data` }; // 원하는 데이터 입력
    }

    // 수정된 엑셀을 버퍼로 저장
    const updatedBuffer = write(workbook, { type: "buffer", bookType: "xlsx" });

    // 파일을 클라이언트로 반환 (다운로드 링크 제공)
    return new NextResponse(updatedBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=updated_taxform.xlsx",
      },
    });
  } catch (error) {
    console.error("파일 처리 오류:", error);
    return NextResponse.json({ error: "파일 수정 실패" }, { status: 500 });
  }
}
