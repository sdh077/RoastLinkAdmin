"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { OrderCustom } from "@/interface/business";
import { IDepart } from "@/interface/depart";

const ExcelInvoice = ({
  orders,
  disabled,
  depart,
  depart_dt
}: {
  orders: OrderCustom[],
  disabled: boolean,
  depart: IDepart,
  depart_dt: string
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/excel/invoice", { method: "POST", body: JSON.stringify({ orders, depart, depart_dt }) });

      if (!response.ok) throw new Error("파일 다운로드 실패");

      // 파일 다운로드 처리
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "taxform.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("다운로드 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Button
        onClick={handleDownload}
        disabled={loading && disabled}
      >
        {loading ? "다운로드 중..." : "엑셀 다운로드"}
      </Button>
    </div>
  );
};

export default ExcelInvoice;
