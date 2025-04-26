import { NextResponse } from 'next/server'

const FORM_API_URL = process.env.FORM_API_URL

if (!FORM_API_URL) {
  throw new Error('FORM_API_URL is not defined in the environment variables')
}

export async function GET() {
  try {
    const response = await fetch(`${FORM_API_URL}/form`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Response not OK:', response.statusText)
      throw new Error('Failed to fetch forms')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 400 }
    )
  }
}