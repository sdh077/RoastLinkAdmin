"use client";

import React, { useEffect, useState } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  const [isMount, setMount] = useState(false)
  useEffect(() => {
    setMount(true)
  }, [])

  if (!isMount) {
    return null
  }
  return (
    <>
      {children}
    </>
  )
}