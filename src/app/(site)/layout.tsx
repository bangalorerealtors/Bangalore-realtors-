import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='overflow-x-hidden w-full'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
