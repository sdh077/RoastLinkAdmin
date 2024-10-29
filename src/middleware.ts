
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const supabase = await createClient()
  const session = await supabase.auth.getSession()
  if (!session.data.session)
    return NextResponse.redirect(new URL('/', request.url))
}

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {

//   return NextResponse.redirect(new URL('/', request.url))
// }
export const config = { matcher: ["/user/:path*"] }