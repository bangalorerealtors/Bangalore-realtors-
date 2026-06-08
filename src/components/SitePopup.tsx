'use client'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import PhoneInput from '@/components/shared/PhoneInput'

const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Office Space']
const BUDGETS = [
  'Under ₹50 Lakhs', '₹50L – ₹1 Cr', '₹1 Cr – ₹1.5 Cr',
  '₹1.5 Cr – ₹2 Cr', '₹2 Cr – ₹3 Cr', '₹3 Cr – ₹5 Cr', 'Above ₹5 Cr',
]

export default function SitePopup() {
  const [visible, setVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    countryCode: '+91',
    email: '',
    property_type: '',
    budget: '',
  })

  useEffect(() => {
    if (sessionStorage.getItem('site_popup_dismissed')) return
    const timer = setTimeout(() => setVisible(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  const close = () => {
    setVisible(false)
    sessionStorage.setItem('site_popup_dismissed', '1')
  }

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const phone = form.phone.replace(/\D/g, '')
    if (phone.length < 6) { setError('Enter a valid phone number.'); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          phone: `${form.countryCode} ${form.phone.trim()}`,
          email: form.email.trim() || undefined,
          property_slug: 'site-popup',
          property_name: `${form.property_type || 'General'} — ${form.budget || 'Budget not specified'}`,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setSuccess(true)
      setTimeout(close, 2500)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition z-10"
        >
          <Icon icon="ph:x" className="text-lg" />
        </button>

        {/* Top banner */}
        <div className="bg-primary rounded-t-2xl px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon icon="ph:buildings-fill" className="text-white text-xl" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Find Your Dream Property</p>
              <p className="text-white/80 text-sm">Get personalised recommendations from our experts</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon icon="ph:check-circle-fill" className="text-green-500 text-4xl" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white text-lg">Thank you!</p>
              <p className="text-gray-500 dark:text-white/50 text-sm mt-1">Our team will reach out within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <input
                type="text" required
                value={form.full_name}
                onChange={e => set('full_name', e.target.value)}
                placeholder="Your Full Name *"
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />

              {/* Phone with Country Code */}
              <div>
                <PhoneInput
                  value={form.phone}
                  countryCode={form.countryCode}
                  onChange={v => set('phone', v)}
                  onCountryChange={v => set('countryCode', v)}
                  placeholder="Phone Number *"
                  required
                />
              </div>

              {/* Email (optional) */}
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="Email Address (optional)"
                className="w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />

              {/* Property Type + Budget */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    value={form.property_type}
                    onChange={e => set('property_type', e.target.value)}
                    className="w-full border border-gray-200 dark:border-white/10 dark:bg-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
                  >
                    <option value="">Property Type</option>
                    {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <Icon icon="ph:caret-down" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
                </div>
                <div className="relative">
                  <select
                    value={form.budget}
                    onChange={e => set('budget', e.target.value)}
                    className="w-full border border-gray-200 dark:border-white/10 dark:bg-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
                  >
                    <option value="">Budget</option>
                    {BUDGETS.map(b => <option key={b}>{b}</option>)}
                  </select>
                  <Icon icon="ph:caret-down" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                  <Icon icon="ph:warning-circle" /> {error}
                </div>
              )}

              <button
                type="submit" disabled={submitting}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-dark transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting
                  ? <><Icon icon="ph:circle-notch" className="animate-spin" /> Please wait...</>
                  : <><Icon icon="ph:paper-plane-tilt" /> Get Free Consultation</>}
              </button>
              <button type="button" onClick={close} className="text-xs text-gray-400 hover:text-gray-600 text-center">
                No thanks, I&apos;ll browse on my own
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
