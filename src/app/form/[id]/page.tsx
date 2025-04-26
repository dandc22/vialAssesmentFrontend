'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FormConfig, FormInputType, ApiFormResponse } from '@/types/form'
import FormView from './components/FormView'

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

  return <FormView formConfig={formConfig} />
}