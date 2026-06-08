import Image from 'next/image'

const Logo: React.FC = () => {
  return (
    <>
      {/* Light mode: white bg logo */}
      <Image
        src='/images/header/logo-light.png'
        alt='Bangalore Realtors'
        width={200}
        height={60}
        unoptimized
        className='dark:hidden'
        priority
      />
      {/* Dark mode: transparent bg logo */}
      <Image
        src='/images/header/logo-dark.png'
        alt='Bangalore Realtors'
        width={200}
        height={60}
        unoptimized
        className='hidden dark:block'
        priority
      />
    </>
  )
}

export default Logo
