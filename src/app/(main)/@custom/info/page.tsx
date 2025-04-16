export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { } = await params
  const { } = await searchParams
  return (
    <div>
    </div>
  )
}