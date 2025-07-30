"use client"

import { useEffect, useState } from "react"

interface StatsCounterProps {
  end: number
  suffix?: string
  duration?: number
}

export function StatsCounter({ end, suffix = "", duration = 2000 }: StatsCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}
