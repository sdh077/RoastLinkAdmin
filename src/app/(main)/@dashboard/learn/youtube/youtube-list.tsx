'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { IYoutube } from './page'

function getYoutubeId(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?\s]{11})/)
  return match?.[1] ?? null
}

function YoutubeRow({ item, onDelete }: { item: IYoutube; onDelete: (id: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: item.title, youtube_url: item.youtube_url, description: item.description ?? '', order: item.order })
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/learn/youtube/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast({ title: '수정 완료' })
      setEditing(false)
      router.refresh()
    } catch {
      toast({ title: '수정에 실패했습니다' })
    } finally {
      setSaving(false)
    }
  }

  const del = async () => {
    if (!confirm('삭제하시겠습니까?')) return
    const res = await fetch(`/api/learn/youtube/${item.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast({ title: '삭제 완료' })
      onDelete(item.id)
    } else {
      toast({ title: '삭제에 실패했습니다' })
    }
  }

  const videoId = getYoutubeId(form.youtube_url)

  return (
    <div className='border rounded-xl p-4 space-y-3'>
      {editing ? (
        <div className='space-y-2'>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label className='text-xs text-muted-foreground mb-1 block'>제목</label>
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className='text-xs text-muted-foreground mb-1 block'>순서</label>
              <Input type='number' value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label className='text-xs text-muted-foreground mb-1 block'>유튜브 URL</label>
            <Input value={form.youtube_url} onChange={e => setForm(p => ({ ...p, youtube_url: e.target.value }))} placeholder='https://www.youtube.com/watch?v=...' />
          </div>
          <div>
            <label className='text-xs text-muted-foreground mb-1 block'>설명</label>
            <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder='설명 (선택)' />
          </div>
          <div className='flex gap-2 justify-end'>
            <Button variant='outline' size='sm' onClick={() => setEditing(false)}>취소</Button>
            <Button size='sm' onClick={save} disabled={saving}>{saving ? '저장 중...' : '저장'}</Button>
          </div>
        </div>
      ) : (
        <div className='flex gap-4'>
          {videoId && (
            <img
              src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
              alt={item.title}
              className='w-32 h-20 object-cover rounded-lg flex-shrink-0'
            />
          )}
          <div className='flex-1 min-w-0'>
            <div className='flex justify-between items-start'>
              <div>
                <span className='text-xs text-muted-foreground mr-2'>#{item.order}</span>
                <span className='font-medium'>{item.title}</span>
              </div>
              <div className='flex gap-1 flex-shrink-0'>
                <Button variant='ghost' size='sm' onClick={() => setEditing(true)}>수정</Button>
                <Button variant='ghost' size='sm' className='text-destructive' onClick={del}>삭제</Button>
              </div>
            </div>
            {item.description && <p className='text-sm text-muted-foreground mt-1 truncate'>{item.description}</p>}
            <p className='text-xs text-muted-foreground mt-1 truncate'>{item.youtube_url}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function AddForm({ onAdd }: { onAdd: (item: IYoutube) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', youtube_url: '', description: '', order: 0 })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.title || !form.youtube_url) {
      toast({ title: '제목과 URL은 필수입니다' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/learn/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      toast({ title: '추가 완료' })
      onAdd(data)
      setForm({ title: '', youtube_url: '', description: '', order: 0 })
      setOpen(false)
    } catch {
      toast({ title: '추가에 실패했습니다' })
    } finally {
      setSaving(false)
    }
  }

  if (!open) return (
    <Button onClick={() => setOpen(true)} className='w-full' variant='outline'>+ 유튜브 링크 추가</Button>
  )

  return (
    <div className='border rounded-xl p-4 space-y-2 border-dashed'>
      <div className='grid grid-cols-2 gap-2'>
        <div>
          <label className='text-xs text-muted-foreground mb-1 block'>제목</label>
          <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder='영상 제목' />
        </div>
        <div>
          <label className='text-xs text-muted-foreground mb-1 block'>순서</label>
          <Input type='number' value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
        </div>
      </div>
      <div>
        <label className='text-xs text-muted-foreground mb-1 block'>유튜브 URL</label>
        <Input value={form.youtube_url} onChange={e => setForm(p => ({ ...p, youtube_url: e.target.value }))} placeholder='https://www.youtube.com/watch?v=...' />
      </div>
      <div>
        <label className='text-xs text-muted-foreground mb-1 block'>설명</label>
        <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder='설명 (선택)' />
      </div>
      <div className='flex gap-2 justify-end'>
        <Button variant='outline' size='sm' onClick={() => setOpen(false)}>취소</Button>
        <Button size='sm' onClick={save} disabled={saving}>{saving ? '추가 중...' : '추가'}</Button>
      </div>
    </div>
  )
}

export function YoutubeList({ initial }: { initial: IYoutube[] }) {
  const [items, setItems] = useState(initial)

  return (
    <div className='space-y-3'>
      <AddForm onAdd={item => setItems(p => [...p, item].sort((a, b) => a.order - b.order))} />
      {items.length === 0 && (
        <div className='text-center text-muted-foreground py-12'>등록된 링크가 없습니다</div>
      )}
      {items.map(item => (
        <YoutubeRow
          key={item.id}
          item={item}
          onDelete={id => setItems(p => p.filter(i => i.id !== id))}
        />
      ))}
    </div>
  )
}
