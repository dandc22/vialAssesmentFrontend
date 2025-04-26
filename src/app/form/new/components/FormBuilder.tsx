'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import InputTypeMenu from './InputTypeMenu'

interface FormField {
  id: string
  type: 'text' | 'password' | 'number'
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
          type={field.type}
          placeholder={`Enter ${field.type}`}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled
        />
      </div>
    </div>
  )
}

function DroppableArea({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: 'form-area',
  })

  return (
    <div ref={setNodeRef} className="flex-1 bg-white rounded-lg shadow-lg min-h-[600px] p-6">
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
        type: field.type,
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
        console.log('data ---------> ', JSON.stringify(data))
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
      const type = active.id.toString().replace('new-', '') as 'text' | 'password' | 'number'
      const newField: FormField = {
        id: `field-${Date.now()}`,
        type,
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <DroppableArea>
              {formFields.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-600 text-lg">
                  Drag and drop form elements here
                </div>
              ) : (
                <SortableContext items={formFields} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
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
      </div>
    </div>
  )
}