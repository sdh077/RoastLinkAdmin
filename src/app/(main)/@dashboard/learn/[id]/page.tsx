import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { ArticleForm } from '../article-form'
import { ILearnArticle } from '../page'

async function getArticle(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'business' } }
  )
  const { data } = await supabase.from('learn_article').select('*').eq('id', id).single<ILearnArticle>()
  return data
}

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await getArticle(id)
  if (!article) notFound()

  return (
    <div>
      <h1 className='text-xl font-bold mb-6'>글 수정</h1>
      <ArticleForm initial={article} />
    </div>
  )
}
