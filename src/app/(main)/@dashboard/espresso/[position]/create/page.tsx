import React from 'react'
import EspressoPage from './main'

const Page = async ({ params }: { params: Promise<{ position: string }> }) => {
  const { position } = await params
  return (
    <EspressoPage position={position} />
  )
}

export default Page