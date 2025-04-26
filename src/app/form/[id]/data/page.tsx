'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FormSubmission } from '@/types/submission'
import SubmissionList from './components/SubmissionList'

export default function FormDataPage() {
  const { id } = useParams()
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/source-records?formId=${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch form data')
        }
        const apiResponse = await response.json()
        setSubmissions(apiResponse.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch form data')
      } finally {
        setLoading(false)
      }
    }

    fetchFormData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="animate-pulse text-center">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-50 p-4 rounded-md text-red-600">{error}</div>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="min-h-screen p-6">
        <div className="text-center text-gray-600">No submissions found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mb-4 flex items-center">
        <Link
          href={`/form/${id}`}
          className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          ← Back to Form
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Form Submissions</h1>
        <SubmissionList submissions={submissions} />
      </div>
    </div>
  )
}