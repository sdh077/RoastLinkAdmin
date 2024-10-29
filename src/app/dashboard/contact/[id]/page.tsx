import { Contact } from "@/interface/contact"
import { createClient } from "@/lib/supabase/server"
import ContactEdit from "./contact-edit"
import { BiArrowBack } from "react-icons/bi"
import Link from "next/link"

const getContact = async (id: string) => {
  const supabase = await createClient()
  return await supabase.from('contact_business')
    .select('*')
    .eq('id', id)
    .single<Contact>()
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { data: contact } = await getContact(id as string)
  if (!contact) return <></>
  return (
    <div className="relative z-20 py-4 lg:py-8 container">
      <div className="px-8">
        <Link href={'/dashboard'} className="inline-flex items-center gap-1"><BiArrowBack />목록으로</Link>
        <h4 className="text-xl lg:text-3xl lg:leading-tight  tracking-tight font-medium text-black dark:text-white">
          [{contact.purpose}] {contact.shop} - {contact.name}
        </h4>

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
  )
}