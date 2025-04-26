'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DndContext, DragEndEvent, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import InputTypeMenu from './InputTypeMenu'
import { FormInputType } from '@/types/form'

interface FormField {
  id: string
  type: FormInputType
  label: string
  order: number
}

interface SortableFieldProps {
  field: FormField
  onUpdate: (id: string, newLabel: string) => void
  onDelete: (id: string) => void
  isActive: boolean
}

function SortableField({ field, onUpdate, onDelete, isActive }: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border border-gray-200 rounded-md ${isDragging || isActive ? 'opacity-50 bg-gray-50 border-indigo-500' : ''
        }`}
      {...attributes}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            className="cursor-move text-gray-400 hover:text-gray-600"
            {...listeners}
          >
            ⋮⋮
          </button>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate(field.id, e.target.value)}
            className="text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1"
          />
        </div>
        <button
          onClick={() => onDelete(field.id)}
          className="text-gray-400 hover:text-red-500"
        >
          ×
        </button>
      </div>
      <div className="mt-1">
        <input
          type={field.type === FormInputType.DATETIME ? 'datetime-local' : field.type.toLowerCase()}
          placeholder={`Enter ${field.type.toLowerCase()}`}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled
        />
      </div>
    </div>
  )
}

function DroppableArea({
  children,
  activeId
}: {
  children: React.ReactNode
  activeId: string | null
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-area',
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 h-auto min-h-[400px] flex flex-col rounded-lg border-2 border-dashed transition-colors ${
        isOver && activeId?.toString().startsWith('new-')
          ? 'border-indigo-500 bg-indigo-100/70 shadow-lg'
          : activeId?.toString().startsWith('new-')
            ? 'border-indigo-400 bg-indigo-50/50'
            : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {children}
    </div>
  )
}

export default function FormBuilder() {
  const [formName, setFormName] = useState('')
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!formName) {
      setError('Form name is required')
      return
    }
    if (formFields.length === 0) {
      setError('At least one field is required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    // Transform formFields array into expected fields record
    const fields = formFields.reduce((acc, field) => {
      acc[field.id] = {
        type: field.type.toLowerCase(),
        question: field.label,
        required: true // You might want to make this configurable
      }
      return acc
    }, {} as Record<string, { type: string; question: string; required: boolean }>)

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formName,
          fields,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create form')
      }

      // Redirect to forms list or show success message
      window.location.href = '/forms'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create form')
    } finally {
      setIsSubmitting(false)
    }
  }


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    // Handle sorting existing fields
    if (!active.id.toString().startsWith('new-')) {
      if (active.id !== over.id) {
        setFormFields((fields) => {
          const oldIndex = fields.findIndex((f) => f.id === active.id)
          const newIndex = fields.findIndex((f) => f.id === over.id)
          return arrayMove(fields, oldIndex, newIndex)
        })
      }
      return
    }

    // Handle adding new field
    if (over.id === 'form-area') {
      const typeStr = active.id.toString().replace('new-', '').toLowerCase()
      const type = FormInputType[typeStr.toUpperCase() as keyof typeof FormInputType]
      const newField: FormField = {
        id: `field-${Date.now()}`,
        type: type,
        label: `New ${type} field`,
        order: formFields.length,
      }
      setFormFields([...formFields, newField])
    }
  }

  const handleFieldUpdate = (id: string, newLabel: string) => {
    setFormFields(fields =>
      fields.map(field =>
        field.id === id ? { ...field, label: newLabel } : field
      )
    )
  }

  const handleFieldDelete = (id: string) => {
    setFormFields(fields => fields.filter(field => field.id !== id))
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
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      <div className="mb-8">
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Enter form name"
          className="w-full px-4 py-2 text-xl font-semibold text-gray-900 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white placeholder-gray-400"
        />
      </div>

      <div className="flex gap-8">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <DroppableArea activeId={activeId}>
            {formFields.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                </svg>
                <p className="text-lg">Drag and drop form elements here</p>
                <p className="text-sm text-gray-500 mt-2">Click and drag items from the menu on the right</p>
              </div>
            ) : (
              <SortableContext items={formFields} strategy={verticalListSortingStrategy}>
                <div className="space-y-4 p-4 pb-8 min-h-0 overflow-y-auto">
                  {formFields.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      onUpdate={handleFieldUpdate}
                      onDelete={handleFieldDelete}
                      isActive={activeId === field.id}
                    />
                  ))}
                </div>
              </SortableContext>
            )}
          </DroppableArea>
          <InputTypeMenu />
        </DndContext>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md text-white font-medium ${isSubmitting
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Form'}
        </button>
      </div>
    </>
  )
}