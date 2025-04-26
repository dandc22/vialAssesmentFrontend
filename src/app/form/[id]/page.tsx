'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FormConfig, FormInputType, ApiFormResponse } from '@/types/form'
import FormInput from './components/FormInput'

export default function ViewForm() {
  const { id } = useParams()
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms?id=${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch form')
        }
        const apiResponse = await response.json() as ApiFormResponse

        // Transform API response into component format
        const formConfig: FormConfig = {
          id: apiResponse.data.id,
          name: apiResponse.data.name,
          fields: Object.entries(apiResponse.data.fields).map(([fieldId, field]) => ({
            id: fieldId,
            type: field.type.toUpperCase() as FormInputType,
            label: field.question,
            required: field.required
          }))
        }

        setFormConfig(formConfig)
      } catch (err) {
        setError('Failed to load form configuration')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [id])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (error || !formConfig) {
    return <div className="p-4 text-red-500">{error || 'Form not found'}</div>
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-2">
          Preview Form: {formConfig.name}
        </h1>
      </div>
      <form className="space-y-4">
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
              />
            </div>
          </div>
        ))}
      </form>
    </>
  )
}