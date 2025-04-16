'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"

export function DeliveryModal({ invoice }: { invoice: string | null }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!invoice}>배송추적</Button>
      </DialogTrigger>
      <DialogContent className="w-[1000px]">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <iframe src={`https://trace.cjlogistics.com/next/tracking.html?wblNo=${invoice}`} width={900} height={500}>
            </iframe>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )

}