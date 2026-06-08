'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

const LOCATIONS = [
  'Whitefield', 'Sarjapur Road', 'Hebbal', 'Electronic City',
  'Koramangala', 'HSR Layout', 'Devanahalli', 'Yelahanka',
  'Marathahalli', 'JP Nagar', 'Indiranagar', 'Bannerghatta Road',
  'Kanakapura Road', 'Mysore Road', 'Tumkur Road', 'Bellary Road',
  'Old Airport Road', 'New BEL Road', 'Rajajinagar', 'Jayanagar',
]

const BHK_TYPES = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '4+ BHK']
const PROPERTY_TYPES = ['All Types', 'Apartment', 'Villa', 'Plot', 'Office Space', 'Luxury Villa', 'Residential']
const PROPERTY_STATUS = ['Ready to Move', 'Under Construction']

export default function Hero() {
  const router = useRouter()
  const [tab, setTab] = useState<'Buy' | 'Rent'>('Buy')
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [bhkType, setBhkType] = useState('')
  const [propertyStatus, setPropertyStatus] = useState('')
  const [propertyType, setPropertyType] = useState('All Types')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [propertyTypeOption, setPropertyTypeOption] = useState<'Full House' | 'Land/Plot'>('Full House')

  const filtered = LOCATIONS.filter(l =>
    l.toLowerCase().includes(search.toLowerCase()) && search.length > 0
  )

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('area', location)
    if (propertyType && propertyType !== 'All Types') params.set('category', propertyType.toLowerCase().replace(' ', '-'))
    if (bhkType) params.set('bhk', bhkType)
    if (propertyStatus) params.set('status', propertyStatus.toLowerCase().replace(/ /g, '-'))
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className='!py-0 overflow-x-hidden'>
      <div className='bg-gradient-to-b from-skyblue via-lightskyblue dark:via-[#4298b0] to-white/10 dark:to-black/10 overflow-hidden relative'>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-52 pb-10 md:pb-8'>
          <div className='relative text-white dark:text-dark text-center md:text-start z-10 max-w-2xl'>
            <p className='text-inherit text-xm font-medium'>Bangalore, Karnataka</p>
            <h1 className='text-inherit text-6xl sm:text-9xl font-semibold -tracking-wider mt-4 mb-4'>
              Your Dream Home Awaits
            </h1>
            <p className='text-white/80 dark:text-dark/70 text-lg mb-8'>
              10 years of curated expertise, unwavering integrity, and deeply rooted knowledge — guiding Bangalore&apos;s finest families to their perfect home.
            </p>

            {/* Search Card */}
            <div className='bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden'>
              {/* Buy / Rent tabs */}
              <div className='flex border-b border-gray-100 dark:border-white/10'>
                {(['Buy', 'Rent'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 sm:flex-none px-8 py-3.5 text-sm font-semibold border-b-2 transition ${tab === t
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-white/50 dark:hover:text-white'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Main search row */}
              <div className='flex flex-col sm:flex-row gap-0 sm:gap-0'>
                {/* City */}
                <div className='relative sm:border-r border-gray-100 dark:border-white/10 flex items-center'>
                  <select
                    className='w-full sm:w-40 pl-4 pr-8 py-4 text-sm text-gray-700 dark:text-white bg-transparent focus:outline-none appearance-none cursor-pointer font-medium'
                    defaultValue="Bangalore"
                  >
                    <option>Bangalore</option>
                    <option>Mysore</option>
                    <option>Hubli</option>
                  </select>
                  <Icon icon='ph:caret-down' className='absolute right-3 text-gray-400 pointer-events-none text-sm' />
                </div>

                {/* Locality search */}
                <div className='relative flex-1 sm:border-r border-gray-100 dark:border-white/10'>
                  <input
                    type='text'
                    placeholder='Search localities or landmarks'
                    value={search || location}
                    onChange={e => {
                      setSearch(e.target.value)
                      setLocation('')
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    className='w-full px-4 py-4 text-sm text-black dark:text-white bg-transparent focus:outline-none placeholder-gray-400'
                  />
                  {showSuggestions && filtered.length > 0 && (
                    <div className='absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-xl rounded-xl mt-1 z-50 overflow-hidden border border-gray-100 dark:border-white/10'>
                      {filtered.map(loc => (
                        <button
                          key={loc}
                          type='button'
                          onMouseDown={() => { setLocation(loc); setSearch(loc); setShowSuggestions(false) }}
                          className='w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-white hover:bg-primary/10 hover:text-primary transition flex items-center gap-2'
                        >
                          <Icon icon='ph:map-pin-simple' className='text-primary' />{loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className='bg-primary hover:bg-dark text-white px-6 py-4 font-semibold flex items-center gap-2 justify-center transition whitespace-nowrap sm:rounded-none rounded-b-lg'
                >
                  <Icon icon='ph:magnifying-glass' className='text-lg' />
                  <span className='hidden sm:inline'>Search</span>
                  <span className='sm:hidden'>Search Properties</span>
                </button>
              </div>

              {/* Filter row */}
              <div className='flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5'>
                {/* Full House / Land-Plot radio */}
                <div className='flex items-center gap-3'>
                  <label className='flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 dark:text-white'>
                    <input
                      type='radio'
                      name='propertyGroup'
                      checked={propertyTypeOption === 'Full House'}
                      onChange={() => setPropertyTypeOption('Full House')}
                      className='accent-primary w-4 h-4'
                    />
                    Full House
                  </label>
                  <label className='flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 dark:text-white'>
                    <input
                      type='radio'
                      name='propertyGroup'
                      checked={propertyTypeOption === 'Land/Plot'}
                      onChange={() => setPropertyTypeOption('Land/Plot')}
                      className='accent-primary w-4 h-4'
                    />
                    Land/Plot
                  </label>
                </div>

                <div className='w-px h-5 bg-gray-200 dark:bg-white/10 hidden sm:block' />

                {/* BHK Type */}
                <div className='relative'>
                  <select
                    value={bhkType}
                    onChange={e => setBhkType(e.target.value)}
                    className='pl-3 pr-7 py-1.5 text-sm text-gray-600 dark:text-white bg-transparent border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none appearance-none cursor-pointer'
                  >
                    <option value=''>BHK Type</option>
                    {BHK_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <Icon icon='ph:caret-down' className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs' />
                </div>

                {/* Property Status */}
                <div className='relative'>
                  <select
                    value={propertyStatus}
                    onChange={e => setPropertyStatus(e.target.value)}
                    className='pl-3 pr-7 py-1.5 text-sm text-gray-600 dark:text-white bg-transparent border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none appearance-none cursor-pointer'
                  >
                    <option value=''>Property Status</option>
                    {PROPERTY_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Icon icon='ph:caret-down' className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs' />
                </div>

                {/* Property Type */}
                <div className='relative'>
                  <select
                    value={propertyType}
                    onChange={e => setPropertyType(e.target.value)}
                    className='pl-3 pr-7 py-1.5 text-sm text-gray-600 dark:text-white bg-transparent border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none appearance-none cursor-pointer'
                  >
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <Icon icon='ph:caret-down' className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs' />
                </div>

                {/* New Builder Projects checkbox */}
                <label className='flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 dark:text-white ml-auto'>
                  <input type='checkbox' className='accent-primary w-4 h-4 rounded' />
                  New Builder Projects
                </label>
              </div>
            </div>

            {/* Quick location pills */}
            <div className='flex flex-wrap gap-2 mt-4 justify-center md:justify-start'>
              {['Whitefield', 'Sarjapur Road', 'Hebbal', 'Koramangala'].map(l => (
                <button
                  key={l}
                  onClick={() => { setLocation(l); setSearch(l) }}
                  className='text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition'
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className='hidden md:block absolute -top-2 -right-68'>
            <Image
              src={'/images/hero/heroBanner.png'}
              alt='heroImg'
              width={1082}
              height={1016}
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  )
}
