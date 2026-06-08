import { GraphView } from "./graph-view"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function GraphPage({
  params,
}: {
  params: Promise<{ position: string }>
}) {
  const { position } = await params

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/espresso/${position}`}>
          <Button variant="outline" size="sm">← 목록으로</Button>
        </Link>
        <h1 className="text-lg font-semibold">에스프레소 그래프</h1>
      </div>
      <GraphView position={position} />
    </div>
  )
}
