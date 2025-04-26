import { NextResponse } from 'next/server'

const FORM_API_URL = process.env.FORM_API_URL

if (!FORM_API_URL) {
  throw new Error('FORM_API_URL is not defined in the environment variables')
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${FORM_API_URL}/form/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Response not OK:', response.statusText)
      throw new Error('Failed to fetch form')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 400 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(`${FORM_API_URL}/form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.error('Response not OK:', response.statusText)
      console.error('Full response:', response)
      throw new Error('Failed to create form')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating form:', error)
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 400 }
    )
  }
}
