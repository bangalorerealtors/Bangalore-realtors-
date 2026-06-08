import { createClient } from '@/lib/supabase/server'
import PropertyForm from '@/components/Admin/PropertyForm'
import { notFound } from 'next/navigation'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select(`*, property_images(*), property_unit_plans(*)`)
    .eq('id', id)
    .single()

  if (!property) notFound()

  return <PropertyForm property={property} isEdit />
}
