import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NotFound() {
  const headersList = await headers()
  const domain = headersList.get('referer')
  return (
    <div>
      <h2>Not Found: {domain}</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/">홈으로 이동</Link>
      </p>
    </div>
  )
}