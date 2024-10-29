import React from 'react'

export default function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
      {children}
    </h2>
  )
}
