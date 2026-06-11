"use client"

import { useState } from "react"
import { GraphView } from "@/app/(main)/@dashboard/espresso/[position]/graph/graph-view"

const POSITIONS = [
  { label: "은편 (ep)", value: "ep" },
  { label: "온선재 (os)", value: "os" },
]

export function EmployeeGraphView({ defaultPosition }: { defaultPosition: string }) {
  const [position, setPosition] = useState(defaultPosition)

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {POSITIONS.map(p => (
          <button
            key={p.value}
            onClick={() => setPosition(p.value)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              position === p.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-transparent text-muted-foreground border-border'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <GraphView position={position} />
    </div>
  )
}
