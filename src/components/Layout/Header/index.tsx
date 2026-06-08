'use client'
import { navLinks } from '@/app/api/navlink'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import NavLink from './Navigation/NavLink'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const Header: React.FC = () => {
  const [sticky, setSticky] = useState(false)
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [mapComingSoon, setMapComingSoon] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const sideMenuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
      setNavbarOpen(false)
    }
  }

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleScroll])

  const isHomepage = pathname === '/'

  return (
    <>
      <header className={`fixed h-24 py-1 z-50 w-full bg-transparent transition-all duration-300 lg:px-0 px-4 ${sticky ? "top-3" : "top-0"}`}>
        <nav className={`container mx-auto max-w-8xl flex items-center justify-between py-4 duration-300 ${sticky ? "shadow-lg bg-white dark:bg-dark rounded-full top-5 px-4 " : "shadow-none top-0"}`}>
          <div className='flex justify-between items-center gap-2 w-full'>
            <div>
              <Link href='/'>
                <Image
                  src={'/images/header/logo-dark.png'}
                  alt='logo'
                  width={150}
                  height={68}
                  unoptimized={true}
                  className={`${isHomepage ? sticky ? "block dark:hidden" : "hidden" : sticky ? "block dark:hidden" : "block dark:hidden"}`}
                />
                <Image
                  src={'/images/header/logo.png'}
                  alt='logo'
                  width={150}
                  height={68}
                  unoptimized={true}
                  className={`${isHomepage ? sticky ? "hidden dark:block" : "block" : sticky ? "dark:block hidden" : "dark:block hidden"}`}
                />
              </Link>
            </div>
            <div className='flex items-center gap-2 sm:gap-4'>
              <button
                className='hover:cursor-pointer'
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Icon
                  icon={'solar:sun-bold'}
                  width={32}
                  height={32}
                  className={`dark:hidden block ${isHomepage
                    ? sticky
                      ? 'text-dark'
                      : 'text-white'
                    : 'text-dark'
                    }`}
                />
                <Icon
                  icon={'solar:moon-bold'}
                  width={32}
                  height={32}
                  className='dark:block hidden text-white'
                />
              </button>

              {/* MapView Button */}
              <button
                onClick={() => setMapComingSoon(true)}
                className={`hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition ${isHomepage
                  ? sticky
                    ? 'border-dark text-dark dark:border-white dark:text-white hover:bg-dark hover:text-white dark:hover:bg-white dark:hover:text-dark'
                    : 'border-white text-white hover:bg-white hover:text-dark'
                  : 'border-dark text-dark dark:border-white dark:text-white hover:bg-dark hover:text-white dark:hover:bg-white dark:hover:text-dark'
                  }`}
              >
                <Icon icon='ph:map-trifold' width={18} height={18} />
                Map View
              </button>

              <div>
                <button
                  onClick={() => setNavbarOpen(!navbarOpen)}
                  className={`flex items-center gap-3 p-2 sm:px-5 sm:py-3 rounded-full font-semibold hover:cursor-pointer border ${isHomepage
                    ? sticky
                      ? 'text-white bg-dark dark:bg-white dark:text-dark dark:hover:text-white dark:hover:bg-dark hover:text-dark hover:bg-white border-dark dark:border-white'
                      : 'text-dark bg-white dark:text-dark hover:bg-transparent hover:text-white border-white'
                    : 'bg-dark text-white hover:bg-transparent hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-transparent dark:hover:text-white duration-300'
                    }`}
                  aria-label='Toggle mobile menu'>
                  <span>
                    <Icon icon={'ph:list'} width={24} height={24} />
                  </span>
                  <span className='hidden sm:block'>Menu</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {
          navbarOpen && (
            <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
          )
        }

        <div
          ref={sideMenuRef}
          className={`fixed top-0 right-0 h-full w-full bg-dark shadow-lg transition-transform duration-300 max-w-2xl ${navbarOpen ? 'translate-x-0' : 'translate-x-full'} z-50 px-20 overflow-auto no-scrollbar`}
        >
          <div className="flex flex-col h-full justify-between">
            <div className="">
              <div className='flex items-center justify-start py-10'>
                <button
                  onClick={() => setNavbarOpen(false)}
                  aria-label='Close mobile menu'
                  className='bg-white p-3 rounded-full hover:cursor-pointer'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'>
                    <path
                      fill='none'
                      stroke='black'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
              <nav className='flex flex-col items-start gap-4'>
                <ul className='w-full'>
                  {navLinks.map((item, index) => (
                    <NavLink key={index} item={item} onClick={() => setNavbarOpen(false)} />
                  ))}
                  <li>
                    <button
                      onClick={() => { setNavbarOpen(false); setMapComingSoon(true) }}
                      className='w-full text-left py-4 border-b border-white/10 text-white hover:text-primary transition flex items-center gap-2 text-lg font-medium'
                    >
                      <Icon icon='ph:map-trifold' width={20} height={20} />
                      Map View
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            <div className='flex flex-col gap-1 my-16 text-white'>
              <p className='text-base sm:text-xm font-normal text-white/40'>
                Contact
              </p>
              <Link href="mailto:info@bangalorerealtors.com" className='text-base sm:text-xm font-medium text-inherit hover:text-primary'>
                info@bangalorerealtors.com
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Map Coming Soon Modal */}
      {mapComingSoon && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={() => setMapComingSoon(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="ph:map-trifold" className="text-primary text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-dark dark:text-white mb-2">Map View</h3>
            <p className="text-gray-500 dark:text-white/50 text-sm mb-6">
              We&apos;re working on an interactive map experience to help you explore properties by location. Coming soon!
            </p>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Icon icon="ph:clock" className="text-base" />
              Coming Soon
            </div>
            <button
              onClick={() => setMapComingSoon(false)}
              className="block w-full py-3 bg-dark dark:bg-white text-white dark:text-dark rounded-xl font-semibold hover:opacity-80 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
