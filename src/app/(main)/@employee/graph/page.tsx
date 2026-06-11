import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EmployeeGraphView } from "./graph-view"

export default async function GraphPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { position = 'ep' } = await searchParams

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/?position=${position}`}>
          <Button variant="outline" size="sm">← 목록으로</Button>
        </Link>
        <h1 className="text-lg font-semibold">에스프레소 그래프</h1>
      </div>
      <EmployeeGraphView defaultPosition={position as string} />
    </div>
  )
}
