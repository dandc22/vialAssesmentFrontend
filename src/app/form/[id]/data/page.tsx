'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface SourceDataItem {
  id: string
  question: string
  answer: string
  sourceRecordId: string
}

interface FormSubmission {
  id: string
  formId: string
  sourceData: SourceDataItem[]
}

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

        <div className="space-y-8">
          {submissions.map((submission: FormSubmission) => (
            <div key={submission.id} className="border rounded-lg p-4">
              <div className="border-b pb-2 mb-4">
                <p className="text-sm text-gray-500">Submission ID</p>
                <p className="text-gray-900">{submission.id}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Responses</p>
                <div className="space-y-2">
                  {submission.sourceData.map((item: SourceDataItem) => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-700">{item.question}</p>
                      <p className="text-gray-900">
                        {item.answer.includes('T00:00:00.000Z') 
                          ? new Date(item.answer).toLocaleDateString()
                          : item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}