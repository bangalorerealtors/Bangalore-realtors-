import { createClient } from '@/lib/supabase/server'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import PublicPropertyCard from '@/components/Properties/PropertyCard'

export default async function Properties() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('*, property_images(url, sort_order)')
    .eq('is_active', true)
    .eq('possession_status', 'New Launch')
    .order('created_at', { ascending: false })
    .limit(6)

  if (!properties || properties.length === 0) return null

  return (
    <section>
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
        <div className='mb-16 flex flex-col gap-3'>
          <div className='flex gap-2.5 items-center justify-center'>
            <Icon icon='ph:house-simple-fill' width={20} height={20} className='text-primary' />
            <p className='text-base font-semibold text-dark/75 dark:text-white/75'>New Launches</p>
          </div>
          <h2 className='text-40 lg:text-52 font-medium text-black dark:text-white text-center tracking-tight leading-11 mb-2'>
            The Finest New Addresses in Bangalore.
          </h2>
          <p className='text-xm font-normal text-black/50 dark:text-white/50 text-center'>
            Be among the first to discover Bangalore&apos;s most coveted new developments — handpicked for location, developer reputation, and long-term investment value. We present only what we would confidently recommend to our own families.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
          {properties.map(property => (
            <PublicPropertyCard key={property.id} property={property} />
          ))}
        </div>
        <div className='flex justify-center mt-12'>
          <Link href='/properties' className='py-4 px-10 bg-primary text-white rounded-full font-semibold hover:bg-dark transition'>
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  )
}
