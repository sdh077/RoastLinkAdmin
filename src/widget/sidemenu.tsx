import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { BiMenu } from "react-icons/bi";
import { signOut, useSession } from "next-auth/react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/interface/user";
import Link from "next/link";

export function Sidemenu() {
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = React.useState<User>({ id: 0, name: '', user_id: '' })
  const supabase = createClient()
  const session = useSession()
  React.useEffect(() => {
    const userId = session?.data?.user?.id
    if (!userId) return
    supabase.from('profile').select('*').eq('user_id', userId).single()
      .then(d => setUser(d.data))

  }, [session])
  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost">
          <BiMenu />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-[250px] flex flex-col gap-8 justify-between items-center h-full">
          {user.id !== 0 ?
            <>
              <DrawerHeader>
                <DrawerTitle>{user.name}</DrawerTitle>
                <DrawerDescription></DrawerDescription>
              </DrawerHeader>
              <div className="my-8 px-4">
                <Link href={'/user/wholesale'} onClick={() => setOpen(false)}>
                  원두 신청
                </Link>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline" onClick={() => signOut()}>Log out</Button>
                </DrawerClose>
              </DrawerFooter>
            </>
            :
            <>
              <DrawerHeader>
                <DrawerTitle>
                  <Link href={'/auth/signin'}>
                    <Button variant="outline">Login</Button>
                  </Link>
                </DrawerTitle>
              </DrawerHeader>
            </>
          }
        </div>
      </DrawerContent>
    </Drawer>
  )
}
