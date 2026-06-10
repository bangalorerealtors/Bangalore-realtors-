import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import Script from 'next/script'

const font = Bricolage_Grotesque({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bangalore Realtors - Premium Real Estate in Bangalore',
  description: 'Discover premium residential and commercial properties in Bangalore.',
  openGraph: {
    title: 'Bangalore Realtors - Premium Real Estate in Bangalore',
    description: 'Discover premium residential and commercial properties in Bangalore.',
    url: 'https://bangalorerealtors.com',
    siteName: 'Bangalore Realtors',
    images: [
      {
        url: 'https://bangalorerealtors.com/images/og-image.jpg',
        width: 1200,
        height: 627,
        alt: 'Bangalore Realtors',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bangalore Realtors - Premium Real Estate in Bangalore',
    description: 'Discover premium residential and commercial properties in Bangalore.',
    images: ['https://bangalorerealtors.com/images/header/logo-og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} bg-white dark:bg-black antialiased`}>
        <NextTopLoader color="#07be8a" />
        <ThemeProvider attribute="class" enableSystem defaultTheme="light">
          {children}
        </ThemeProvider>
        {/* Tawk.to Live Chat */}
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6a1870679665091c33dad2b3/1jpnne5ck';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
