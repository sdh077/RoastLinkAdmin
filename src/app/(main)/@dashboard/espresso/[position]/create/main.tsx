'use client'
import { EspressoCreateForm } from '@/components/espresso/espresso-create-form'

export default function EspressoPage({ position }: { position: string }) {
  return <EspressoCreateForm position={position} redirectTo={`/espresso/${position}`} />
}
