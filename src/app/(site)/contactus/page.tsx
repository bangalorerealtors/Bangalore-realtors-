'use client'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import PhoneInput from '@/components/shared/PhoneInput'

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Office Space']
const BUDGETS = [
  'Under ₹50 Lakhs',
  '₹50L – ₹1 Cr',
  '₹1 Cr – ₹1.5 Cr',
  '₹1.5 Cr – ₹2 Cr',
  '₹2 Cr – ₹3 Cr',
  '₹3 Cr – ₹5 Cr',
  'Above ₹5 Cr',
]

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '', phone: '', countryCode: '+91', email: '',
    property_type: '', budget: '', message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.name,
          phone: `${form.countryCode} ${form.phone}`,
          email: form.email || undefined,
          property_slug: 'contact-form',
          property_name: `${form.property_type || 'General'} — Budget: ${form.budget || 'Not specified'}`,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  const inp = 'px-6 py-3.5 border border-black/10 dark:border-white/10 dark:bg-transparent dark:text-white rounded-full outline-primary focus:outline w-full bg-white'
  const sel = `${inp} appearance-none cursor-pointer`

  return (
    <div className='container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-44 pb-14 md:pb-28'>
      <div className='mb-16'>
        <div className='flex gap-2.5 items-center justify-center mb-3'>
          <Icon icon='ph:house-simple-fill' width={20} height={20} className='text-primary' />
          <p className='text-base font-semibold text-badge dark:text-white/90'>Contact us</p>
        </div>
        <div className='text-center'>
          <h3 className='text-4xl sm:text-52 font-medium tracking-tighter text-black dark:text-white mb-3 leading-10 sm:leading-14'>
            Have questions? Ready to help!
          </h3>
          <p className='text-xm font-normal tracking-tight text-black/50 dark:text-white/50 leading-6'>
            Looking for your dream home or ready to invest? Tell us what you need and our team will reach out within 24 hours.
          </p>
        </div>
      </div>

      <div className='border border-black/10 dark:border-white/10 rounded-2xl p-4 shadow-xl dark:shadow-white/10'>
        <div className='flex flex-col lg:flex-row lg:items-stretch gap-12'>
          {/* Left info panel */}
          <div className='relative w-full lg:w-auto lg:min-w-[380px]'>
            <Image
              src='/images/contactUs/contactUs.jpg'
              alt='Contact'
              width={497}
              height={535}
              className='rounded-2xl brightness-50 h-full w-full object-cover'
              unoptimized
            />
            <div className='absolute top-6 left-6 lg:top-12 lg:left-12 flex flex-col gap-2'>
              <h5 className='text-xl xs:text-2xl mobile:text-3xl font-medium tracking-tight text-white'>
                Contact Information
              </h5>
              <p className='text-sm xs:text-base mobile:text-xm font-normal text-white/80'>
                Ready to find your dream home or make a smart investment? We&apos;re here to help!
              </p>
            </div>
            <div className='absolute bottom-6 left-6 lg:bottom-12 lg:left-12 flex flex-col gap-4 text-white'>
              <Link href='tel:+918296383275' className='w-fit'>
                <div className='flex items-center gap-4 group w-fit'>
                  <Icon icon='ph:phone' width={32} height={32} />
                  <p className='text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary'>
                    +91 918296 383275
                  </p>
                </div>
              </Link>
              <Link href='mailto:info@bangalorerealtors.com' className='w-fit'>
                <div className='flex items-center gap-4 group w-fit'>
                  <Icon icon='ph:envelope-simple' width={32} height={32} />
                  <p className='text-sm xs:text-base mobile:text-xm font-normal group-hover:text-primary'>
                    info@bangalorerealtors.com
                  </p>
                </div>
              </Link>
              <div className='flex items-center gap-4'>
                <Icon icon='ph:map-pin' width={32} height={32} />
                <p className='text-sm xs:text-base mobile:text-xm font-normal'>
                  Koramangala, Bangalore - 560095
                </p>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className='flex-1'>
            {success ? (
              <div className='flex flex-col items-center justify-center h-full gap-4 py-20'>
                <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center'>
                  <Icon icon='ph:check-circle-fill' className='text-primary text-4xl' />
                </div>
                <h3 className='text-2xl font-semibold text-gray-900 dark:text-white'>Thank you!</h3>
                <p className='text-gray-500 text-center'>
                  We&apos;ve received your enquiry and will get back to you within 24 hours.
                </p>
                <button onClick={() => setSuccess(false)} className='text-primary text-sm hover:underline'>
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-6'>
                  {/* Name */}
                  <input
                    type='text' required
                    placeholder='Full Name *'
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className={inp}
                  />

                  {/* Phone with Country Code */}
                  <div>
                    <label className='text-sm font-medium text-gray-600 dark:text-white/70 block mb-1.5 pl-1'>
                      Phone Number *
                    </label>
                    <PhoneInput
                      value={form.phone}
                      countryCode={form.countryCode}
                      onChange={v => set('phone', v)}
                      onCountryChange={v => set('countryCode', v)}
                      required
                      className='w-full'
                    />
                  </div>

                  {/* Email (optional) */}
                  <input
                    type='email'
                    placeholder='Email address (optional)'
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    className={inp}
                  />

                  {/* Property type + Budget dropdowns */}
                  <div className='flex flex-col lg:flex-row gap-6'>
                    <div className='relative flex-1'>
                      <select
                        value={form.property_type}
                        onChange={e => set('property_type', e.target.value)}
                        className={sel}
                      >
                        <option value=''>Property Type</option>
                        {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <Icon icon='ph:caret-down' className='absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                    </div>
                    <div className='relative flex-1'>
                      <select
                        value={form.budget}
                        onChange={e => set('budget', e.target.value)}
                        className={sel}
                      >
                        <option value=''>Budget Range</option>
                        {BUDGETS.map(b => <option key={b}>{b}</option>)}
                      </select>
                      <Icon icon='ph:caret-down' className='absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                    </div>
                  </div>

                  {/* Message */}
                  <textarea
                    rows={5}
                    placeholder='Tell us more about what you are looking for... (optional)'
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    className='px-6 py-3.5 border border-black/10 dark:border-white/10 dark:bg-transparent dark:text-white rounded-2xl outline-primary focus:outline resize-none'
                  />

                  {error && (
                    <div className='bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2'>
                      <Icon icon='ph:warning-circle' /> {error}
                    </div>
                  )}

                  <button
                    type='submit'
                    disabled={submitting}
                    className='px-8 py-4 rounded-full bg-primary text-white text-base font-semibold w-full mobile:w-fit hover:cursor-pointer hover:bg-dark duration-300 flex items-center gap-2 disabled:opacity-60'
                  >
                    {submitting ? (
                      <><Icon icon='ph:circle-notch' className='animate-spin' /> Sending...</>
                    ) : (
                      <><Icon icon='ph:paper-plane-tilt' /> Send Enquiry</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
