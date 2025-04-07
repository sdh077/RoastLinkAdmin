'use client'

import { useEffect, useState } from "react";

export default function Layout({
  espresso,
  dashboard,
}: {
  espresso: React.ReactNode
  dashboard: React.ReactNode
}) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("id");
    setId(id);
  }, []);
  return (
    <div>
      {id === '47b1e020-aade-4311-93ca-8ee282a242b3' ?
        espresso :
        dashboard
      }
    </div>
  )
}