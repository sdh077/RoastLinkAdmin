'use client'

import { useEffect, useState } from "react";

export default function Layout({
  employee,
  dashboard,
  custom,
}: {
  employee: React.ReactNode
  dashboard: React.ReactNode
  custom: React.ReactNode
}) {
  const [type, setType] = useState<number | null>(0);

  useEffect(() => {
    const type = localStorage.getItem("type") ?? "1";
    setType(Number(type));
  }, []);
  if (type == 0) return <></>
  return (
    <div>
      {type === 1 ?
        employee :
        type === 2 ?
          dashboard :
          custom
      }
    </div>
  )
}