import React from 'react'

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="underline-black text-2xl font-bold">
      {children}
    </div>
  )
}

export default SectionTitle