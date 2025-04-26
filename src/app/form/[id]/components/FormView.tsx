'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FormConfig, FormInputType } from '@/types/form'
import FormInput from './FormInput'

interface FormViewProps {
  formConfig: FormConfig
}

interface FormData {
  [key: string]: string
}

export default function FormView({ formConfig }: FormViewProps) {
  const [formData, setFormData] = useState<FormData>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const validateForm = (): boolean => {
    const missingFields = formConfig.fields
      .filter(field => field.required && !formData[field.id])
      .map(field => field.label)

    console.log('formData ---------> ', JSON.stringify(formData))

    if (missingFields.length > 0) {
      setError(`Please fill in required fields: ${missingFields.join(', ')}`)
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/source-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: formConfig.id,
          sourceData: formData
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to submit form')
      }

      setSuccess(true)
      setFormData({})
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center">
        <Link
          href="/forms"
          className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          ← Back to Forms
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
          {formConfig.name}
        </h1>
      </div>

      {success ? (
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-green-800">Form submitted successfully!</p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-2 text-sm text-green-600 hover:text-green-800"
          >
            Submit another response
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          {formConfig.fields.map((field) => (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-md"
            >
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              </div>
              <div className="mt-1">
                <FormInput
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  required={field.required}
                  placeholder={`Enter ${field.type.toLowerCase()}`}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              </div>
            </div>
          ))}

          <div className="mt-6">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${submitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {submitting ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>
      )}
    </>
  )
}