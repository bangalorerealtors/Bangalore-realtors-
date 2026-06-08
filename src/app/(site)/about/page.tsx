import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@iconify/react'

export const metadata: Metadata = {
  title: 'About Us | Bangalore Realtors',
  description: 'Learn about Bangalore Realtors — your trusted partner for premium real estate in Bangalore since 2010.',
}

const stats = [
  { value: '10+', label: 'Years Serving Bangalore' },
  { value: '1,200+', label: 'Successful Transactions' },
  { value: '3,500+', label: 'Families Who Trust Us' },
  { value: '98%', label: 'Client Satisfaction' },
]

const values = [
  {
    icon: 'ph:handshake',
    title: 'Integrity First',
    desc: 'We operate with complete transparency — always. No hidden charges, no commission-driven recommendations, no misleading information. Every listing we present is independently verified and K-RERA compliant. Because you deserve counsel you can trust without reservation.',
  },
  {
    icon: 'ph:magnifying-glass',
    title: 'Deep Local Expertise',
    desc: '10 years, exclusively in Bangalore. We have witnessed the city transform — from quiet residential pockets to world-class technology corridors. That institutional knowledge of micro-markets, upcoming infrastructure, and locality-level nuances is what separates advice from opinion, and expertise from experience.',
  },
  {
    icon: 'ph:headset',
    title: 'End-to-End Support',
    desc: 'A home purchase is among the most significant decisions of your life. We honour that gravity by being present at every stage — property shortlisting, developer negotiations, site visits, home loan facilitation, legal due diligence, and registration — until the keys are in your hands.',
  },
  {
    icon: 'ph:shield-check',
    title: 'K-RERA Compliant',
    desc: 'Every project we represent is registered under K-RERA. We meticulously verify developer track records, project documentation, and legal standing before presenting any property to a client. Your investment is protected not by chance, but by design.',
  },
]

const milestones = [
  { year: '2010', event: 'Founded with a singular conviction — honest, buyer-first real estate guidance for Bangalore\'s families.' },
  { year: '2013', event: 'Expanded to Whitefield and Sarjapur Road as the IT corridor entered its most transformational decade.' },
  { year: '2016', event: 'Launched our commercial real estate vertical, serving enterprises seeking office spaces across Electronic City and the Outer Ring Road.' },
  { year: '2019', event: 'Crossed 500 successful property transactions — a milestone built entirely on client referrals.' },
  { year: '2022', event: 'Formalised partnerships with 30+ respected developers including Prestige, Brigade, and Sobha — unlocking exclusive launch access for clients.' },
  { year: '2024', event: 'Launched our digital-first platform, bringing seamless property discovery to NRI investors and the modern Bangalore homebuyer.' },
]

export default function AboutPage() {
  return (
    <main className="pb-20">

      {/* B1 · ABOUT PAGE BANNER */}
      <section className="bg-dark relative overflow-hidden pt-24 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark to-primary/20" />
        <div className="container max-w-7xl mx-auto px-5 2xl:px-0 relative z-10">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold flex items-center gap-2 mb-4">
              <Icon icon="ph:buildings-fill" className="text-xl" /> About Us
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Bangalore&apos;s Most Trusted Real Estate Partner.
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              10 years of integrity-first guidance, rooted in Bangalore, dedicated entirely to you.
            </p>
            <Link href="/contactus" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition">
              Talk to Our Team <Icon icon="ph:arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* B2 · STATS BAR */}
      <section className="!py-0">
        <div className="bg-primary">
          <div className="container max-w-7xl mx-auto px-5 2xl:px-0 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-4xl font-bold text-white mb-2">{s.value}</p>
                  <p className="text-white/75 font-medium text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* B3 · OUR STORY */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-5 2xl:px-0">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary font-semibold flex items-center gap-2 mb-3">
                <Icon icon="ph:book-open" className="text-xl" /> Our Story
              </p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Built on Trust. Grown Through Relationships.
              </h2>
              <div className="flex flex-col gap-4 text-gray-600 dark:text-white/70 leading-relaxed">
                <p>
                  Bangalore Realtors was founded in 2010 by Rahul — a professional who understood that the greatest gap in real estate was not one of supply, but of integrity. After witnessing firsthand how difficult it was to navigate the market without biased counsel, he set out to build something fundamentally different: a firm where the buyer&apos;s interest would always, unconditionally, come first.
                </p>
                <p>
                  From a single desk, we grew through something that cannot be manufactured — trust. One family referred us to another. One honest recommendation earned ten more. Today, our team spans every major locality in Bangalore, from the technology corridors of Whitefield and Electronic City to the lakeside precincts of Hebbal and the emerging frontiers of Devanahalli.
                </p>
                <p>
                  We have forged partnerships with over 30 of India&apos;s most respected developers and guided more than 1,200 property transactions to completion. But our proudest achievement is neither scale nor volume — it is the families who continue to call us first, years after their transaction is done, because they know our counsel remains unchanged: transparent, informed, and entirely in their interest.
                </p>
                <p>
                  This is the Bangalore Realtors way. Not merely transacting — advising. Not merely listing — guiding. Not merely closing deals — opening doors to lives well-lived.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-100 dark:bg-white/10 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-dark/60 flex items-center justify-center">
                  <Icon icon="ph:buildings-fill" className="text-white/20 text-[120px]" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-white/10">
                <p className="text-3xl font-bold text-primary">10+</p>
                <p className="text-sm text-gray-500 dark:text-white/50 mt-0.5">Years serving<br />Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B4 · OUR VALUES */}
      <section className="py-20 bg-gray-50 dark:bg-white/5">
        <div className="container max-w-7xl mx-auto px-5 2xl:px-0">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold flex items-center gap-2 justify-center mb-3">
              <Icon icon="ph:heart" className="text-xl" /> Our Values
            </p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">What Sets Us Apart.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:border-primary/30 hover:shadow-md transition">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon icon={v.icon} className="text-primary text-2xl" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B5 · OUR JOURNEY */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-5 2xl:px-0">
          <div className="text-center mb-12">
            <p className="text-primary font-semibold flex items-center gap-2 justify-center mb-3">
              <Icon icon="ph:clock-countdown" className="text-xl" /> Our Journey
            </p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">10 Years of Milestones.</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-white/10" />
            <div className="flex flex-col gap-10">
              {milestones.map((m, i) => (
                <div key={m.year} className={`flex items-start gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className={`bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-5 inline-block max-w-xs ${i % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                      <p className="text-primary font-bold text-lg mb-1">{m.year}</p>
                      <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-primary rounded-full flex-shrink-0 mt-5 ring-4 ring-primary/20" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* B6 · OUR TEAM */}
      <section className="py-20 bg-gray-50 dark:bg-white/5">
        <div className="container max-w-7xl mx-auto px-5 2xl:px-0">
          <div className="text-center mb-8">
            <p className="text-primary font-semibold flex items-center gap-2 justify-center mb-3">
              <Icon icon="ph:users" className="text-xl" /> Our Team
            </p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">The Person Behind the Promise.</h2>
            <p className="text-gray-500 dark:text-white/50 text-lg max-w-2xl mx-auto">
              Behind every successful transaction is someone who believes this work is more than a transaction. Our practice is built on depth of knowledge, warmth of counsel, and an unwavering commitment to your best interests — in every conversation, every recommendation, every outcome.
            </p>
          </div>
          <div className="flex justify-center mt-10">
            <div className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-gray-100 dark:border-white/10 text-center hover:border-primary/30 hover:shadow-md transition max-w-sm w-full">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="ph:user-circle" className="text-primary text-5xl" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-xl">Rahul</h3>
              <p className="text-primary text-sm font-medium mt-1">Founder &amp; CEO</p>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-3 leading-relaxed">
                The architect of Bangalore Realtors&apos; integrity-first ethos, Rahul brings over 10 years of deep Bangalore real estate experience and an uncompromising dedication to the buyer&apos;s interest. His founding conviction — that honest counsel should never be a luxury — remains the north star of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* B7 · PAGE CTA */}
      <section className="py-20">
        <div className="container max-w-3xl mx-auto px-5 2xl:px-0 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Ready to find your perfect property?</h2>
          <p className="text-gray-500 dark:text-white/50 text-lg mb-8">
            Browse our handpicked listings or connect with Rahul directly. The right home — and the right guidance — await.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/properties" className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition flex items-center gap-2">
              <Icon icon="ph:buildings" /> Browse Properties
            </Link>
            <Link href="/contactus" className="border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition flex items-center gap-2">
              <Icon icon="ph:phone" /> Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
