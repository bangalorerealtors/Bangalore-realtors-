import Hero from '@/components/Home/Hero'
import AboutSection from '@/components/Home/AboutSection'
import Properties from '@/components/Home/Properties'
import LocationsSection from '@/components/Home/Locations'
import GetInTouch from '@/components/Home/GetInTouch'
import FAQ from '@/components/Home/FAQs'
import SitePopup from '@/components/SitePopup'

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <Properties />
      <LocationsSection />
      <GetInTouch />
      <FAQ />
      <SitePopup />
    </main>
  )
}
