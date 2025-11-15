"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HackathonTimerProps {
  endDate: Date
}

export function HackathonTimer({ endDate }: HackathonTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = endDate.getTime()
      const difference = end - now

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false,
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  if (timeLeft.expired) {
    return (
      <Card className="border-border/50 bg-card/95">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-white">Hackathon Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-xl font-bold text-destructive">Hackathon Ended</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/95">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-white">Hackathon Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
              <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
              <div className="text-xs text-muted-foreground mt-1">Days</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
              <div className="text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground mt-1">Hours</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
              <div className="text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground mt-1">Minutes</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-secondary/50 rounded-lg p-3 border border-border/50">
              <div className="text-2xl font-bold text-white">{String(timeLeft.seconds).padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground mt-1">Seconds</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

