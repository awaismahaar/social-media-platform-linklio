'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export const Account = ({ defaultTab = 0, firstTab, secondTab }) => {
  const [currentTab, setCurrentTab] = useState(defaultTab)

  return (
    <div className="flex w-full max-w-[340px] sm:max-w-[440px] justify-center gap-2">
      <div className='h-full w-full bg-gray-100 dark:bg-neutral-950 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100
'>
        <Switch currentTab={currentTab} setTab={setCurrentTab} />
        <div className="overflow-hidden rounded-xl border border-neutral-200 p-2 shadow-sm dark:border-neutral-900">
          {currentTab === 0 && firstTab}
          {currentTab === 1 && secondTab}
        </div>
      </div>
    </div>
  )
}

const Switch = ({ setTab, currentTab }) => (
  <div
    className={`relative flex w-full items-center rounded-lg bg-neutral-100 py-1 text-neutral-900 dark:bg-neutral-800 dark:text-white`}>
    <motion.div
      trdivansition={{ type: 'keyframes', duration: 0.15, ease: 'easeInOut' }}
      animate={currentTab === 0 ? { x: 4 } : { x: '98%' }}
      initial={currentTab === 0 ? { x: 4 } : { x: '98%' }}
      className={`absolute h-5/6 w-1/2 rounded-md bg-white shadow-sm dark:bg-neutral-950`}
    />
    <button
      onClick={() => {
        setTab(0)
      }}
      className="z-10 h-9 w-full rounded-md text-center">
      Login
    </button>
    <button
      onClick={() => {
        setTab(1)
      }}
      className="z-10 h-9 w-full rounded-md text-center">
      Create Account
    </button>
  </div>
)
