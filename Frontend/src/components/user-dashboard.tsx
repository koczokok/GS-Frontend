"use client"

import { useEffect, useState } from "react"
import { HackathonTimer } from "./hackathon-timer"
import { TodoList } from "./todo-list"
import { HackathonInformation } from "@/types/hackathon-information"

import { getHackathonInformation } from "@/lib/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Default hackathon end date - fallback if API fails
const DEFAULT_HACKATHON_END_DATE = new Date("2024-12-31T23:59:59")

interface UserDashboardProps {
  hackathonEndDate?: Date
}

export function UserDashboard({ hackathonEndDate: propHackathonEndDate }: UserDashboardProps) {
  const [hackathonEndDate, setHackathonEndDate] = useState<Date | null>(
    propHackathonEndDate || null
  )
  const [loading, setLoading] = useState(!propHackathonEndDate)

  useEffect(() => {
    // If hackathon end date is provided as prop, use it
    if (propHackathonEndDate) {
      setHackathonEndDate(propHackathonEndDate)
      setLoading(false)
      return
    }

    // Otherwise, fetch from API
    const fetchHackathonInformation = async () => {
      try {
        setLoading(true)
        const hackathonInfo = await getHackathonInformation()
        
        if (hackathonInfo) {
          setHackathonEndDate(new Date(hackathonInfo.endDate))
        } else {
          // If no hackathon information found, use default
          setHackathonEndDate(DEFAULT_HACKATHON_END_DATE)
        }
      } catch (err) {
        console.error("Error fetching hackathon information:", err)
        // Use default on error
        setHackathonEndDate(DEFAULT_HACKATHON_END_DATE)
      } finally {
        setLoading(false)
      }
    }

    fetchHackathonInformation()
  }, [propHackathonEndDate])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="border-border/50 bg-card/95 rounded-lg p-4">
          <p className="text-muted-foreground text-sm">Loading hackathon information...</p>
        </div>
        <TodoList />
      </div>
    )
  }

  const endDate = hackathonEndDate || DEFAULT_HACKATHON_END_DATE

  return (
    <div className="space-y-4">
      <HackathonTimer endDate={endDate} />
      <TodoList />
    </div>
  )
}

