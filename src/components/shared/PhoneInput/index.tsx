'use client'
import { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { COUNTRY_CODES, DEFAULT_COUNTRY, CountryCode } from '@/data/countryCodes'

interface PhoneInputProps {
  value: string
  countryCode: string
  onChange: (phone: string) => void
  onCountryChange: (dialCode: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export default function PhoneInput({
  value,
  countryCode,
  onChange,
  onCountryChange,
  placeholder = '8296383275',
  required = false,
  className = '',
}: PhoneInputProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const selected = COUNTRY_CODES.find(c => c.dialCode === countryCode) ?? DEFAULT_COUNTRY

  const filtered = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dialCode.includes(search)
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={`relative flex ${className}`}>
      {/* Country code button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-l-xl px-3 py-3 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-white/10 transition whitespace-nowrap min-w-[80px]"
      >
        <span className="text-base">{selected.flag}</span>
        <span className="text-gray-700 dark:text-white font-medium text-xs">{selected.dialCode}</span>
        <Icon icon="ph:caret-down" className="text-gray-400 text-xs ml-0.5" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 z-[999] w-64 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100 dark:border-white/10">
            <input
              type="text"
              placeholder="Search country..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={`${c.code}-${c.dialCode}`}
                type="button"
                onClick={() => { onCountryChange(c.dialCode); setOpen(false); setSearch('') }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-primary/10 hover:text-primary transition ${selected.code === c.code ? 'bg-primary/5 text-primary' : 'text-gray-700 dark:text-white'}`}
              >
                <span className="text-base">{c.flag}</span>
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-xs text-gray-400 dark:text-white/40 font-mono">{c.dialCode}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">No results</p>
            )}
          </div>
        </div>
      )}

      {/* Phone number input */}
      <input
        type="tel"
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border border-l-0 border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white rounded-r-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
    </div>
  )
}
