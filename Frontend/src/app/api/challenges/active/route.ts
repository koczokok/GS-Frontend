import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/challenges/active`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch active challenges' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching active challenges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active challenges' },
      { status: 500 }
    )
  }
}

