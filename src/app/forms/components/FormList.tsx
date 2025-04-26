'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ApiFormConfig } from '@/types/form'

interface ApiFormsResponse {
  statusCode: number
  data: ApiFormConfig[]
  message: string
}

export function FormList() {
  const [forms, setForms] = useState<ApiFormConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('/api/forms/list')
        if (!response.ok) {
          throw new Error('Failed to fetch forms')
        }
        const data: ApiFormsResponse = await response.json()
        setForms(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load forms')
      } finally {
        setLoading(false)
      }
    }

    fetchForms()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return <p className="text-red-600">{error}</p>
  }

  if (forms.length === 0) {
    return <p className="text-gray-600">No forms created yet.</p>
  }

  return (
    <div className="space-y-4">
      {forms.map((form) => (
        <div
          key={form.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
        >
          <h2 className="text-lg font-medium text-gray-900">{form.name}</h2>
          <Link
            href={`/form/${form.id}`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            View Form →
          </Link>
        </div>
      ))}
    </div>
  )
}