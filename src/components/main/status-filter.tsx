'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { useRouterPush } from "@/hooks/use-create-query-string"
import { useSearchParams } from "next/navigation"

export function StatusFilter({ statusType }: { statusType: string[] }) {
  const routerPush = useRouterPush()
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const status = Number(params.get('status') ?? '')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{statusType[Number(status)]}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {statusType.map((status, idx) =>
          <DropdownMenuItem key={status} onClick={() => {
            routerPush('status', idx.toString())
          }}>
            {status}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}