'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { useRouterPush } from "@/hooks/use-create-query-string"
import { ICategory, IProduct } from "@/interface/product"
import { useSearchParams } from "next/navigation"
type Prop = ICategory & { product: IProduct[] }

export function CategoryMenu({ categories }: { categories: Prop[] }) {
  const routerPush = useRouterPush()
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const categoryId = Number(params.get('category') ?? '0')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{categories[categoryId]?.title}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {categories.map((category, idx) =>
          <DropdownMenuItem key={category.id} onClick={() => {
            routerPush('category', idx.toString())
            console.log('first')
          }}>
            {category.title}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}