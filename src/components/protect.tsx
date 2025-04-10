'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedPage() {
  const router = useRouter()

  useEffect(() => {
    const type = localStorage.getItem('type')

    if (type === '1') {
      // 접근 금지
      alert('접근이 허용되지 않았습니다.')
      router.replace('/') // 홈이나 다른 페이지로 리디렉트
    }
  }, [])

  return (
    <div>
    </div>
  )
}
