import { NextRequest, NextResponse } from 'next/server'

const FORM_API_URL = process.env.FORM_API_URL

if (!FORM_API_URL) {
  throw new Error('FORM_API_URL is not defined in the environment variables')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formId, sourceData } = body

    if (!formId || !sourceData) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.FORM_API_URL}/source-record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formId, sourceData }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { message: error.message || 'Failed to submit form' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}