'use client'
import { Button } from '@/components/ui/button'
import { signOut } from '@/hooks/use-fetch-user'

const SignOut = () => {
  return (
    <Button onClick={() => signOut()}>LOG OUT</Button>
  )
}

export default SignOut