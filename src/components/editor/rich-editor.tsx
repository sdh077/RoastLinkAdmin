'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useRef, useState } from 'react'

const TOOLBAR_BUTTONS = [
  { label: 'B', action: (e: any) => e.chain().focus().toggleBold().run(), active: (e: any) => e.isActive('bold'), title: '굵게' },
  { label: 'I', action: (e: any) => e.chain().focus().toggleItalic().run(), active: (e: any) => e.isActive('italic'), title: '기울임' },
  { label: 'H1', action: (e: any) => e.chain().focus().toggleHeading({ level: 1 }).run(), active: (e: any) => e.isActive('heading', { level: 1 }), title: '제목1' },
  { label: 'H2', action: (e: any) => e.chain().focus().toggleHeading({ level: 2 }).run(), active: (e: any) => e.isActive('heading', { level: 2 }), title: '제목2' },
  { label: '•', action: (e: any) => e.chain().focus().toggleBulletList().run(), active: (e: any) => e.isActive('bulletList'), title: '목록' },
  { label: '—', action: (e: any) => e.chain().focus().setHorizontalRule().run(), active: () => false, title: '구분선' },
]

export function RichEditor({ value, onChange }: {
  value: string
  onChange: (html: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'prose max-w-none outline-none min-h-[400px] p-4' },
    },
    immediatelyRender: false,
  })

  const uploadImage = async (file: File) => {
    if (!editor) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/learn/upload', { method: 'POST', body: formData })
      if (!res.ok) return
      const { url } = await res.json()
      editor.chain().focus().setImage({ src: url }).run()
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadImage(file)
    e.target.value = ''
  }

  if (!editor) return null

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
        {TOOLBAR_BUTTONS.map(btn => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onClick={() => btn.action(editor)}
            className={`px-2 py-1 text-sm rounded font-medium transition-colors ${btn.active(editor) ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
          >
            {btn.label}
          </button>
        ))}
        <button
          type="button"
          title="이미지 업로드"
          onClick={() => fileRef.current?.click()}
          className="px-2 py-1 text-sm rounded hover:bg-muted"
        >
          {uploading ? '업로드 중...' : '🖼 이미지'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
