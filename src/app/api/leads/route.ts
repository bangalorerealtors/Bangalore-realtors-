import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { full_name, phone, property_slug, property_name } = body

    if (!full_name || !phone) {
      return NextResponse.json({ message: 'Name and phone are required.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('leads').insert({
      full_name: full_name.trim(),
      phone: phone.trim(),
      property_slug: property_slug ?? null,
      property_name: property_name ?? null,
    })

    if (error) {
      console.error('Lead insert error:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Lead API error:', err)
    return NextResponse.json({ message: 'Server error.' }, { status: 500 })
  }
}
