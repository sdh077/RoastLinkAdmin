'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { RichEditor } from '@/components/editor/rich-editor'
import { ILearnArticle } from './page'

const CATEGORIES = ['BUSINESS', 'COFFEE', 'ROASTING', 'BARISTA', 'ETC']

export function ArticleForm({ initial }: { initial?: Partial<ILearnArticle> }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    writer: initial?.writer ?? '',
    writer_description: initial?.writer_description ?? '',
    category: initial?.category ?? 'BUSINESS',
    date: initial?.date ?? String(new Date().getFullYear()),
    content: initial?.content ?? '',
  })

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.writer || !form.content) {
      toast({ title: '제목, 작성자, 내용은 필수입니다' })
      return
    }
    setSaving(true)
    try {
      const url = initial?.id ? `/api/learn/${initial.id}` : '/api/learn'
      const method = initial?.id ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast({ title: initial?.id ? '수정 완료' : '등록 완료' })
      router.push('/learn')
      router.refresh()
    } catch {
      toast({ title: '저장에 실패했습니다' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!initial?.id || !confirm('정말 삭제하시겠습니까?')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/learn/${initial.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast({ title: '삭제 완료' })
      router.push('/learn')
      router.refresh()
    } catch {
      toast({ title: '삭제에 실패했습니다' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label>제목</Label>
          <Input value={form.title} onChange={set('title')} placeholder='글 제목' />
        </div>
        <div className='space-y-1.5'>
          <Label>카테고리</Label>
          <select
            value={form.category}
            onChange={set('category')}
            className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm'
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className='space-y-1.5'>
          <Label>작성자</Label>
          <Input value={form.writer} onChange={set('writer')} placeholder='이름' />
        </div>
        <div className='space-y-1.5'>
          <Label>연도</Label>
          <Input value={form.date} onChange={set('date')} placeholder='2024' />
        </div>
      </div>

      <div className='space-y-1.5'>
        <Label>작성자 소개</Label>
        <Textarea
          value={form.writer_description}
          onChange={set('writer_description')}
          placeholder='작성자에 대한 간략한 소개'
          rows={3}
        />
      </div>

      <div className='space-y-1.5'>
        <Label>내용</Label>
        <RichEditor
          value={form.content}
          onChange={content => setForm(prev => ({ ...prev, content }))}
        />
      </div>

      <div className='flex justify-between pt-2'>
        {initial?.id ? (
          <Button type='button' variant='destructive' onClick={handleDelete} disabled={saving}>
            삭제
          </Button>
        ) : <div />}
        <div className='flex gap-2'>
          <Button type='button' variant='outline' onClick={() => router.back()}>취소</Button>
          <Button type='submit' disabled={saving}>{saving ? '저장 중...' : '저장'}</Button>
        </div>
      </div>
    </form>
  )
}
