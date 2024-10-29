'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useCreateQueryString } from "@/hooks/use-create-query-string";
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from "react";

export default function CustomPagination({ total }: { total: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const pageNo = Number(params.get("pageNo") ?? "1")
  const pages = [pageNo - 2, pageNo - 1, pageNo, pageNo + 1, pageNo + 2].filter(p => p > 0 && p <= total);
  const createQueryString = useCreateQueryString()

  return (
    <Pagination>
      <PaginationContent>
        {pageNo - 2 > 0 && <PaginationItem>
          <PaginationPrevious href={
            pathname + '?' + createQueryString('pageNo', (pageNo - 5 > 0 ? pageNo - 3 : 1).toString())
          } />
        </PaginationItem>}
        {pages.map(p =>
          <PaginationItem key={`page${p}`}>
            <PaginationLink href={
              pathname + '?' + createQueryString('pageNo', p.toString())
            }
              isActive={pageNo === p}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        )}
        {pageNo + 2 < total && <PaginationItem>
          <PaginationNext href={
            pathname + '?' + createQueryString('pageNo', (pageNo + 5 <= total ? pageNo + 5 : total).toString())
          } />
        </PaginationItem>}
      </PaginationContent>
    </Pagination>
  )
}
