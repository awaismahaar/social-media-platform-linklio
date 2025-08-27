"use client"
import { LineSpinner } from 'ldrs/react'
import 'ldrs/react/LineSpinner.css'
import { useTheme } from 'next-themes'

const SpinnerClient = () => {
    const { theme } = useTheme()
    return (
        <LineSpinner
            size="40"
            stroke="3"
            speed="1"
            color={theme === 'dark' ? '#fff' : '#000'}
        />
    )
}

export default SpinnerClient