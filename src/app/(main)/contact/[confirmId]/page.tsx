import React from 'react'

const page = async ({
  params,
}: {
  params: Promise<{ confirmId: string }>
}) => {
  const { confirmId } = await params

  return (
    <div>{confirmId}</div>
  )
}

export default page