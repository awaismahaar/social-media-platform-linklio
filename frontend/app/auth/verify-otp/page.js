import Otp from '@/components/auth/Otp'
import { AuroraBackground } from '@/components/bg-gradient/aurora-background'
import React from 'react'

const Page = () => {
  return (
    <AuroraBackground>
      <div className='flex justify-center items-center h-screen'>
        <Otp />
      </div>

    </AuroraBackground>
  )
}

export default Page