'use client'

import { useEffect, useState } from "react";

export default function Layout({
  espresso,
  dashboard,
}: {
  espresso: React.ReactNode
  dashboard: React.ReactNode
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
        espresso :
        dashboard
      }
    </div>
  )
}