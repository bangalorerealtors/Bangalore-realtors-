'use client'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import PhoneInput from '@/components/shared/PhoneInput'

type Props = {
  propertySlug: string
  propertyName: string
  children: React.ReactNode
}

export default function LeadGate({ propertySlug, propertyName, children }: Props) {
  const [showPopup, setShowPopup] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    countryCode: '+91',
    email: '',
  })

  useEffect(() => {
    const key = `lead_unlocked_${propertySlug}`
    if (sessionStorage.getItem(key)) {
      setUnlocked(true)
    } else {
      const t = setTimeout(() => setShowPopup(true), 400)
      return () => clearTimeout(t)
    }
  }, [propertySlug])

  useEffect(() => {
    if (showPopup && !unlocked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showPopup, unlocked])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const phone = form.phone.replace(/\D/g, '')
    if (phone.length < 6) {
      setError('Please enter a valid phone number.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          phone: `${form.countryCode} ${form.phone.trim()}`,
          email: form.email.trim() || undefined,
          property_slug: propertySlug,
          property_name: propertyName,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Something went wrong.')
        setSubmitting(false)
        return
      }
      sessionStorage.setItem(`lead_unlocked_${propertySlug}`, '1')
      setUnlocked(true)
      setShowPopup(false)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <>
      <div className={showPopup && !unlocked ? 'pointer-events-none select-none' : ''}>
        {children}
      </div>

      {showPopup && !unlocked && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-primary rounded-t-2xl px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon icon="ph:buildings-fill" className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white font-bold text-base leading-tight">View Full Property Details</p>
                  <p className="text-white/80 text-sm line-clamp-1">{propertyName}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-500 dark:text-white/50 text-sm mb-5 text-center">
                Enter your details to unlock brochure, pricing, floor plans, and more.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Full Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                    placeholder="Rahul Sharma"
                    className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                {/* Phone with Country Code */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block mb-1.5">
                    Phone Number *
                  </label>
                  <PhoneInput
                    value={form.phone}
                    countryCode={form.countryCode}
                    onChange={v => setForm(p => ({ ...p, phone: v }))}
                    onCountryChange={v => setForm(p => ({ ...p, countryCode: v }))}
                    required
                  />
                </div>

                {/* Email (optional) */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-white/80 block mb-1.5">
                    Email Address <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="rahul@email.com"
                    className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
                    <Icon icon="ph:warning-circle" /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-dark transition disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                >
                  {submitting
                    ? <><Icon icon="ph:circle-notch" className="animate-spin" /> Please wait...</>
                    : <><Icon icon="ph:lock-open" /> Unlock Property Details</>}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By continuing, you agree to be contacted by our team regarding this property.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
