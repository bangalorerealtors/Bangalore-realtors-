import Link from 'next/link'
import { Icon } from '@iconify/react'

const stats = [
  { value: '10+', label: 'Years of Excellence', icon: 'ph:calendar-check' },
  { value: '1,200+', label: 'Properties Transacted', icon: 'ph:buildings' },
  { value: '3,500+', label: 'Happy Families Served', icon: 'ph:house-line' },
  { value: '98%', label: 'Client Satisfaction Rate', icon: 'ph:star' },
]

const values = [
  { icon: 'ph:handshake', title: 'Integrity First', desc: 'Complete transparency — always. No hidden charges, no commission-driven recommendations, no misleading information. Every listing we present is independently verified and K-RERA compliant. Because you deserve counsel you can trust, not a pitch you must second-guess.' },
  { icon: 'ph:magnifying-glass', title: 'Deep Local Expertise', desc: '10 years, exclusively in Bangalore. We have witnessed the city transform — from quiet residential pockets to world-class tech corridors. That institutional knowledge of micro-markets, upcoming infrastructure, and locality nuances is what separates advice from opinion.' },
  { icon: 'ph:headset', title: 'End-to-End Support', desc: 'A home purchase is among the most significant decisions of your life. We honour that by being present at every stage — property shortlisting, site visits, home loan facilitation, legal due diligence, and registration — until the keys are in your hands.' },
  { icon: 'ph:shield-check', title: 'K-RERA Compliant', desc: 'Every project we represent is registered under K-RERA. We meticulously verify developer credentials, project documentation, and legal standing before presenting any listing to a client. Your investment is protected by design, not by chance.' },
]

export default function AboutSection() {
  return (
    <section className='!py-0'>
      {/* Stats Bar */}
      <div className='bg-primary'>
        <div className='container max-w-8xl mx-auto px-5 2xl:px-0 py-10'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {stats.map(s => (
              <div key={s.label} className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <Icon icon={s.icon} className='text-white text-2xl' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-white leading-tight'>{s.value}</p>
                  <p className='text-white/75 text-sm'>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className='container max-w-8xl mx-auto px-5 2xl:px-0 py-20'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          {/* Left: Text */}
          <div>
            <div className='flex gap-2.5 items-center mb-4'>
              <Icon icon='ph:buildings-fill' width={20} height={20} className='text-primary' />
              <p className='text-base font-semibold text-dark/75 dark:text-white/75'>About Us</p>
            </div>
            <h2 className='text-40 lg:text-52 font-medium text-black dark:text-white tracking-tight leading-11 mb-6'>
              An Uncompromising Commitment to Your Interests
            </h2>
            <p className='text-xm text-black/60 dark:text-white/60 leading-relaxed mb-4'>
              At Bangalore Realtors, our penchant for putting clients first is reflected in every recommendation, every negotiation, and every transaction we complete. This is not merely a profession — it is a calling, built on the belief that a home is not just a financial asset, but the place where lives unfold and legacies begin.
            </p>
            <p className='text-xm text-black/60 dark:text-white/60 leading-relaxed mb-8'>
              Founded with one conviction — that honest guidance should never be a luxury — we have grown into Bangalore&apos;s most referred real estate advisory, trusted by more than 3,500 families across every major locality in the city.
            </p>
            <div className='flex flex-wrap gap-4'>
              <Link
                href='/about'
                className='inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-semibold hover:bg-dark transition'
              >
                Our Story <Icon icon='ph:arrow-right' />
              </Link>
              <Link
                href='/contactus'
                className='inline-flex items-center gap-2 border border-dark/20 dark:border-white/20 text-dark dark:text-white px-7 py-3.5 rounded-full font-semibold hover:border-primary hover:text-primary transition'
              >
                Talk to Our Team
              </Link>
            </div>
          </div>

          {/* Right: Values Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            {values.map(v => (
              <div
                key={v.title}
                className='bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:border-primary/40 hover:shadow-md transition'
              >
                <div className='w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4'>
                  <Icon icon={v.icon} className='text-primary text-xl' />
                </div>
                <h3 className='font-semibold text-dark dark:text-white mb-2'>{v.title}</h3>
                <p className='text-sm text-black/55 dark:text-white/55 leading-relaxed'>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
