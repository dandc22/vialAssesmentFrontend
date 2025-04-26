'use client'

import { FormInputType } from '@/types/form'

interface FormInputProps {
  type: FormInputType
  id: string
  name: string
  required: boolean
  placeholder?: string
}

export default function FormInput({ type, id, name, required, placeholder }: FormInputProps) {
  const baseInputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-base"

  if (type === FormInputType.DATETIME) {
    return (
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="datetime-local"
            id={`${id}-datetime-local`}
            name={`${id}-datetime-local`}
            required={required}
            className={baseInputClasses}
          />
        </div>
      </div>
    )
  }

  return (
    <input
      type={type.toLowerCase()}
      id={id}
      name={name}
      required={required}
      placeholder={placeholder}
      className={baseInputClasses}
    />
  )
}