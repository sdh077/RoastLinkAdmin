"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import ContactEdit from "./contact-edit"
import { Contact } from "@/interface/contact"
import { createClient } from "@/lib/supabase/client"


export function ContactDetail({
  id,
}: {
  id: number
}) {
  const [contact, setContact] = React.useState<Contact | null>()
  React.useEffect(() => {
    const getContact = async (id: number) => {
      const supabase = await createClient('public')
      return await supabase.from('contact_business')
        .select('*')
        .eq('id', id)
        .single<Contact>()
    }
    getContact(id).then(({ data }) => setContact(data))
  }, [])
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">상세정보</Button>
      </DrawerTrigger>
      <DrawerContent>
        {contact && <div className="mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>[{contact.purpose}] {contact.shop} - {contact.name}</DrawerTitle>
          </DrawerHeader>
          <div className="relative z-20 py-4 lg:py-8">
            <div className="px-8">
              <p className="text-sm lg:text-base  my-4 mx-auto text-neutral-500 font-normal dark:text-neutral-300">
                주소  {contact.address}
              </p>
              <p className="text-sm lg:text-base  my-4 mx-auto text-neutral-500 font-normal dark:text-neutral-300">
                설명 {contact.description}
              </p>
              <p className="text-sm lg:text-base  my-4 mx-auto text-neutral-500 font-normal dark:text-neutral-300">
                연락처 {contact.phone}
              </p>
              <p className="text-sm lg:text-base  my-4 mx-auto text-neutral-500 font-normal dark:text-neutral-300">
                사업자번호 {contact.shop_no}
              </p>
              <hr className="my-8" />
              <ContactEdit contact={contact} />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
        }
      </DrawerContent>
    </Drawer>
  )
}