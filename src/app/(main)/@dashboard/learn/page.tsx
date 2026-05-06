import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export interface ILearnArticle {
  id: number
  title: string
  writer: string
  writer_description: string
  category: string
  date: string
  content: string
  thumbnail: string | null
  created_at: string
}

async function getArticles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'business' } }
  )
  return supabase.from('learn_article')
    .select('id, title, writer, category, date, created_at')
    .order('id', { ascending: false })
    .returns<ILearnArticle[]>()
}

export default async function LearnPage() {
  const { data: articles } = await getArticles()

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-xl font-bold'>아티클 관리</h1>
        <Link href='/learn/create'>
          <Button>새 글 작성</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>제목</TableHead>
            <TableHead>카테고리</TableHead>
            <TableHead>작성자</TableHead>
            <TableHead>연도</TableHead>
            <TableHead>등록일</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles?.map(article => (
            <TableRow key={article.id}>
              <TableCell className='font-medium max-w-[280px] truncate'>{article.title}</TableCell>
              <TableCell><Badge variant='outline'>{article.category}</Badge></TableCell>
              <TableCell>{article.writer}</TableCell>
              <TableCell>{article.date}</TableCell>
              <TableCell className='text-muted-foreground'>{article.created_at?.slice(0, 10)}</TableCell>
              <TableCell>
                <Link href={`/learn/${article.id}`}>
                  <Button variant='ghost' size='sm'>수정</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {!articles?.length && (
            <TableRow>
              <TableCell colSpan={6} className='text-center text-muted-foreground py-12'>
                등록된 글이 없습니다
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
